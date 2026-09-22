-- Profil Pola Pikir MI
-- Supabase schema + server-side scoring
-- Develoved by: Prabu26.dev

create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  client_submission_id uuid not null default gen_random_uuid(),
  instrument_version text not null default '2026.09-v3',
  participant_type text not null check (participant_type in ('teacher','student')),
  participant_name text not null,
  school_raw text not null,
  school_normalized text not null,
  grade smallint null check (grade between 1 and 6),
  phase text null check (phase in ('A','B','C')),
  answers jsonb not null default '[]'::jsonb,
  raw_score integer not null default 0,
  raw_max_score integer not null default 0,
  score integer not null default 0,
  max_score integer not null default 100,
  category text not null default '',
  created_at timestamptz not null default now()
);

alter table public.submissions add column if not exists client_submission_id uuid default gen_random_uuid();
alter table public.submissions add column if not exists instrument_version text default '2026.09-v3';
alter table public.submissions add column if not exists raw_score integer default 0;
alter table public.submissions add column if not exists raw_max_score integer default 0;
alter table public.submissions alter column score set default 0;
alter table public.submissions alter column max_score set default 100;
alter table public.submissions alter column category set default '';

create unique index if not exists submissions_client_id_uidx on public.submissions (client_submission_id);
create index if not exists submissions_school_idx on public.submissions (school_normalized);
create index if not exists submissions_type_idx on public.submissions (participant_type);
create index if not exists submissions_created_idx on public.submissions (created_at desc);

create or replace function public.normalize_school_name(input text)
returns text language plpgsql immutable as $$
declare v text;
begin
  v := upper(trim(coalesce(input,'')));
  v := regexp_replace(v, '[._,/ -]+', ' ', 'g');
  v := regexp_replace(v, '\s+', ' ', 'g');
  v := regexp_replace(v, '\mMADRASAH\s+IBTIDAIYAH\M', 'MI', 'g');
  v := regexp_replace(v, '\mRAUDHATUL\s+ATHFAL\M', 'RA', 'g');
  v := regexp_replace(v, '^(M\s+I|MI)\s+', 'MI ', 'g');
  v := regexp_replace(v, '^(R\s+A|RA)\s+', 'RA ', 'g');
  v := regexp_replace(v, '^(RA|MI)\s+AL\s+', '\1 AL', 'g');
  return trim(v);
end $$;

create or replace function public.prepare_submission()
returns trigger language plpgsql security invoker as $$
declare
  i integer;
  a integer;
  q integer;
  expected_count integer;
  raw integer := 0;
  raw_max integer := 0;
begin
  new.participant_name := upper(regexp_replace(trim(new.participant_name), '\s+', ' ', 'g'));
  new.school_raw := trim(new.school_raw);
  new.school_normalized := public.normalize_school_name(new.school_raw);
  new.instrument_version := '2026.09-v3';

  if new.participant_type = 'teacher' then
    new.grade := null;
    new.phase := null;
    expected_count := 20;
    raw_max := 60;
  else
    if new.grade is null then raise exception 'Kelas murid wajib diisi'; end if;
    new.phase := case when new.grade between 1 and 2 then 'A' when new.grade between 3 and 4 then 'B' else 'C' end;
    expected_count := case new.phase when 'A' then 10 when 'B' then 15 else 20 end;
    raw_max := case new.phase when 'A' then 20 when 'B' then 45 else 60 end;
  end if;

  if jsonb_typeof(new.answers) <> 'array' or jsonb_array_length(new.answers) <> expected_count then
    raise exception 'Jumlah jawaban tidak sesuai instrumen';
  end if;

  for i in 0..expected_count-1 loop
    q := i + 1;
    a := (new.answers->i->>'answerIndex')::integer;
    if new.participant_type = 'teacher' then
      if a < 0 or a > 3 then raise exception 'Pilihan jawaban guru tidak valid'; end if;
      if q = any(array[1,4,7,8,11,12,14,16,17,20]) then raw := raw + a; else raw := raw + (3-a); end if;
    elsif new.phase = 'A' then
      if a < 0 or a > 2 then raise exception 'Pilihan jawaban Fase A tidak valid'; end if;
      if q = any(array[4,7]) then raw := raw + a; else raw := raw + (2-a); end if;
    elsif new.phase = 'B' then
      if a < 0 or a > 3 then raise exception 'Pilihan jawaban Fase B tidak valid'; end if;
      if q = any(array[4,8,12]) then raw := raw + a; else raw := raw + (3-a); end if;
    else
      if a < 0 or a > 3 then raise exception 'Pilihan jawaban Fase C tidak valid'; end if;
      if q = any(array[6,11,14,18]) then raw := raw + a; else raw := raw + (3-a); end if;
    end if;
  end loop;

  new.raw_score := raw;
  new.raw_max_score := raw_max;
  new.score := round(raw * 100.0 / raw_max)::integer;
  new.max_score := 100;

  if new.participant_type = 'teacher' then
    new.category := case when raw <= 20 then 'Pola Pikir Tetap (Fixed Mindset)' when raw <= 33 then 'Pola Pikir Tetap Bertumbuh (Fixed-Growth Mindset)' when raw <= 44 then 'Pola Pikir Bertumbuh Tetap (Growth-Fixed Mindset)' else 'Pola Pikir Bertumbuh (Growth Mindset)' end;
  else
    new.category := case when new.score < 40 then 'Perlu Dukungan untuk Bertumbuh' when new.score < 70 then 'Pola Pikir Bertumbuh Mulai Berkembang' when new.score < 85 then 'Pola Pikir Bertumbuh Berkembang Baik' else 'Pola Pikir Bertumbuh Berkembang Sangat Baik' end;
  end if;
  return new;
end $$;

drop trigger if exists trg_prepare_submission on public.submissions;
create trigger trg_prepare_submission before insert or update on public.submissions
for each row execute function public.prepare_submission();

alter table public.submissions enable row level security;
drop policy if exists "public can submit assessment" on public.submissions;
create policy "public can submit assessment" on public.submissions for insert to anon, authenticated with check (char_length(participant_name) between 2 and 100 and char_length(school_raw) between 2 and 150 and jsonb_typeof(answers) = 'array');

drop policy if exists "admins can read submissions" on public.submissions;
create policy "admins can read submissions" on public.submissions for select to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = 'prabu26.dev@gmail.com');

drop policy if exists "admins can delete submissions" on public.submissions;
create policy "admins can delete submissions" on public.submissions for delete to authenticated using (lower(coalesce(auth.jwt() ->> 'email','')) = 'prabu26.dev@gmail.com');

grant usage on schema public to anon, authenticated;
grant insert on public.submissions to anon, authenticated;
grant select, delete on public.submissions to authenticated;
