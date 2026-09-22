-- Profil Pola Pikir MI
-- Backend schema for Supabase PostgreSQL
-- Developed by: Prabu26.dev

create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  participant_type text not null check (participant_type in ('teacher','student')),
  participant_name text not null,
  school_raw text not null,
  school_normalized text not null,
  grade smallint null check (grade between 1 and 6),
  phase text null check (phase in ('A','B','C')),
  answers jsonb not null default '[]'::jsonb,
  score integer not null,
  max_score integer not null,
  category text not null,
  created_at timestamptz not null default now()
);

create index if not exists submissions_school_idx on public.submissions (school_normalized);
create index if not exists submissions_type_idx on public.submissions (participant_type);
create index if not exists submissions_created_idx on public.submissions (created_at desc);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.normalize_school_name(input text)
returns text
language plpgsql
immutable
as $$
declare
  v text;
begin
  v := upper(trim(coalesce(input,'')));
  v := regexp_replace(v, '[._,/\\-]+', ' ', 'g');
  v := regexp_replace(v, '\s+', ' ', 'g');
  v := regexp_replace(v, '\mMADRASAH IBTIDAIYAH\M', 'MI', 'g');
  v := regexp_replace(v, '\mRAUDHATUL ATHFAL\M', 'RA', 'g');
  -- RA AL HIDAYAH -> RA ALHIDAYAH; MI AL HIDAYAH -> MI ALHIDAYAH
  v := regexp_replace(v, '^(RA|MI) AL\s+', '\1 AL', 'g');
  return trim(v);
end;
$$;

create or replace function public.prepare_submission()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.participant_name := upper(regexp_replace(trim(new.participant_name), '\s+', ' ', 'g'));
  new.school_raw := trim(new.school_raw);
  new.school_normalized := public.normalize_school_name(new.school_raw);

  if new.participant_type = 'teacher' then
    new.grade := null;
    new.phase := null;
  else
    if new.grade is null then
      raise exception 'Kelas murid wajib diisi';
    end if;
    new.phase := case
      when new.grade between 1 and 2 then 'A'
      when new.grade between 3 and 4 then 'B'
      else 'C'
    end;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prepare_submission on public.submissions;
create trigger trg_prepare_submission
before insert or update on public.submissions
for each row execute function public.prepare_submission();

alter table public.submissions enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "public can submit assessment" on public.submissions;
create policy "public can submit assessment"
on public.submissions for insert
to anon, authenticated
with check (
  char_length(participant_name) between 2 and 100
  and char_length(school_raw) between 2 and 150
  and jsonb_typeof(answers) = 'array'
  and score >= 0
  and max_score > 0
  and score <= max_score
);

drop policy if exists "admins can read submissions" on public.submissions;
create policy "admins can read submissions"
on public.submissions for select
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  )
);

drop policy if exists "admins can delete submissions" on public.submissions;
create policy "admins can delete submissions"
on public.submissions for delete
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  )
);

drop policy if exists "admin can see own admin row" on public.admin_users;
create policy "admin can see own admin row"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

-- Setelah membuat user admin di Authentication > Users,
-- daftarkan UUID user tersebut sekali:
-- insert into public.admin_users (user_id) values ('UUID-USER-ADMIN');
