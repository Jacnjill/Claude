-- ============================================================
-- Cyber Hero Academy — Seed Data
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ─── Modules ─────────────────────────────────────────────────────────────────

insert into public.modules (id, title, description, difficulty, order_index, icon, color_accent) values
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Phish Frenzy',
  'Identify suspicious emails and learn to avoid malicious phishing attacks before they compromise your company.',
  'Beginner', 1, '🎣', '#06B6D4'
),
(
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Password Fortress',
  'Defend employee accounts from brute-force attacks by mastering strong passwords and multi-factor authentication.',
  'Intermediate', 2, '🔐', '#FBBF24'
),
(
  'a1b2c3d4-0003-0003-0003-000000000003',
  'The Human Hack',
  'Detect social engineers attempting to manipulate employees into giving up sensitive access.',
  'Advanced', 3, '🕵️', '#F97316'
);

-- ─── Lessons ─────────────────────────────────────────────────────────────────

-- Module 1 — Phish Frenzy
insert into public.lessons (id, module_id, title, story_content, comic_panels, order_index) values
(
  'b1b2c3d4-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'The Suspicious Email',
  'Raja intercepts a suspicious email heading straight to your inbox. Learn to spot the red flags before it''s too late.',
  '[
    {
      "id": 1,
      "image_url": null,
      "speaker": "Narrator",
      "dialogue": "Monday morning. 08:47. A new email arrives in Sarah''s inbox.",
      "caption": "CYBER HERO ACADEMY — MISSION 1"
    },
    {
      "id": 2,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "Hold on, Recruit! That email subject line is screaming at us. ''URGENT: Your account will be suspended in 24 hours!'' — classic urgency trick.",
      "caption": null
    },
    {
      "id": 3,
      "image_url": null,
      "speaker": "Narrator",
      "dialogue": "Raja zooms in on the sender''s address: support@micros0ft-helpdesk.com",
      "caption": null
    },
    {
      "id": 4,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "See that zero in ''micros0ft''? Attackers swap letters with lookalikes to trick your eyes. The real Microsoft would never email from that domain.",
      "caption": "SPOT THE FAKE DOMAIN"
    },
    {
      "id": 5,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "Never click links in suspicious emails. Hover over them first — or go directly to the official website. You''ve got this!",
      "caption": "MISSION BRIEFING COMPLETE"
    }
  ]'::jsonb,
  1
);

-- Module 2 — Password Fortress
insert into public.lessons (id, module_id, title, story_content, comic_panels, order_index) values
(
  'b1b2c3d4-0002-0002-0002-000000000002',
  'a1b2c3d4-0002-0002-0002-000000000002',
  'The Brute-Force Storm',
  'An attacker is hammering the login portal with thousands of password attempts. Raja needs your help to fortify the defences.',
  '[
    {
      "id": 1,
      "image_url": null,
      "speaker": "Narrator",
      "dialogue": "The server alarm blares. A bot army is attempting to brute-force employee accounts.",
      "caption": "CYBER HERO ACADEMY — MISSION 2"
    },
    {
      "id": 2,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "They''ve already cracked three accounts with passwords like ''password123'' and ''company2024''. Predictable patterns are a hacker''s best friend.",
      "caption": null
    },
    {
      "id": 3,
      "image_url": null,
      "speaker": "Narrator",
      "dialogue": "Raja pulls up the password strength monitor. Most employees are using short, common words.",
      "caption": "PASSWORD AUDIT IN PROGRESS"
    },
    {
      "id": 4,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "A strong password is at least 12 characters, mixing UPPERCASE, lowercase, numbers and symbols. Better yet — use a password manager like 1Password or Bitwarden to generate them.",
      "caption": "THE FORMULA FOR A STRONG PASSWORD"
    },
    {
      "id": 5,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "And always enable MFA! Even if attackers steal your password, they still can''t get in without your second factor. Enable it now — it''s your force field.",
      "caption": "ACTIVATE YOUR FORCE FIELD"
    }
  ]'::jsonb,
  1
);

-- Module 3 — The Human Hack
insert into public.lessons (id, module_id, title, story_content, comic_panels, order_index) values
(
  'b1b2c3d4-0003-0003-0003-000000000003',
  'a1b2c3d4-0003-0003-0003-000000000003',
  'The Fake IT Guy',
  'Someone calling themselves "Mike from IT Support" is trying to gain access. Something feels off. Raja is watching.',
  '[
    {
      "id": 1,
      "image_url": null,
      "speaker": "Narrator",
      "dialogue": "Wednesday afternoon. A call comes in for James, a junior analyst.",
      "caption": "CYBER HERO ACADEMY — MISSION 3"
    },
    {
      "id": 2,
      "image_url": null,
      "speaker": "Villain",
      "dialogue": "Hi James, this is Mike from IT. We''ve detected unusual activity on your account. I need your password to run a security audit immediately.",
      "caption": null
    },
    {
      "id": 3,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "STOP. Legitimate IT teams never ask for your password. This is a classic social engineering attack — they''re creating false urgency to bypass your judgement.",
      "caption": "RED FLAG DETECTED"
    },
    {
      "id": 4,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "Always verify identity independently. Hang up and call IT''s official number directly. Never call back a number the suspicious caller gave you.",
      "caption": "HOW TO VERIFY"
    },
    {
      "id": 5,
      "image_url": null,
      "speaker": "Raja",
      "dialogue": "If something feels off — it probably is. Report it to your security team immediately. You just stopped a data breach. Well done, Recruit!",
      "caption": "MISSION COMPLETE"
    }
  ]'::jsonb,
  1
);

-- ─── Quizzes ─────────────────────────────────────────────────────────────────

-- Module 1 quiz questions
insert into public.quizzes (lesson_id, question, options, correct_answer, explanation, order_index) values
(
  'b1b2c3d4-0001-0001-0001-000000000001',
  'An email arrives claiming your account will be suspended. The sender is support@micros0ft-helpdesk.com. What should you do?',
  '[{"id":"a","text":"Click the link and log in to verify"},{"id":"b","text":"Reply asking for more information"},{"id":"c","text":"Do not click anything — report it to your IT/security team"},{"id":"d","text":"Forward it to colleagues to warn them"}]'::jsonb,
  'c',
  'Never click links in suspicious emails. Report them to your IT/security team. Forwarding suspicious emails can spread the phishing link.',
  1
),
(
  'b1b2c3d4-0001-0001-0001-000000000001',
  'Which of these email senders is MOST suspicious?',
  '[{"id":"a","text":"no-reply@yourbank.com"},{"id":"b","text":"support@yourbank.secure-alerts.net"},{"id":"c","text":"updates@yourbank.co.uk"},{"id":"d","text":"noreply@notifications.yourbank.com"}]'::jsonb,
  'b',
  'The real domain is yourbank.com — but in option B, the email is actually from secure-alerts.net, which has nothing to do with your bank. Always check the domain after the @ symbol.',
  2
),
(
  'b1b2c3d4-0001-0001-0001-000000000001',
  'What is "urgency" in a phishing email designed to do?',
  '[{"id":"a","text":"Help you prioritise your inbox"},{"id":"b","text":"Make you act quickly without thinking critically"},{"id":"c","text":"Prove the email is from a legitimate source"},{"id":"d","text":"Speed up a genuine account verification process"}]'::jsonb,
  'b',
  'Creating false urgency is a core social engineering tactic. It triggers a stress response that bypasses critical thinking, causing people to click before they consider the risks.',
  3
);

-- Module 2 quiz questions
insert into public.quizzes (lesson_id, question, options, correct_answer, explanation, order_index) values
(
  'b1b2c3d4-0002-0002-0002-000000000002',
  'Which of these is the strongest password?',
  '[{"id":"a","text":"Password123"},{"id":"b","text":"company2024!"},{"id":"c","text":"Tr0ub4dor&3"},{"id":"d","text":"qX7#mL9$vK2@pN5!"}]'::jsonb,
  'd',
  'Option D is 16 characters long with a mix of uppercase, lowercase, numbers, and symbols — with no recognisable words or patterns. Length + complexity = strength.',
  1
),
(
  'b1b2c3d4-0002-0002-0002-000000000002',
  'What does MFA (Multi-Factor Authentication) protect you from?',
  '[{"id":"a","text":"Slow internet connections"},{"id":"b","text":"Attackers who have already stolen your password"},{"id":"c","text":"Viruses on your device"},{"id":"d","text":"Phishing websites"}]'::jsonb,
  'b',
  'MFA requires a second proof of identity beyond your password. Even if an attacker steals your password, they cannot log in without your second factor (e.g. an authenticator app code).',
  2
),
(
  'b1b2c3d4-0002-0002-0002-000000000002',
  'What is the safest way to manage unique passwords for every account?',
  '[{"id":"a","text":"Write them in a notebook"},{"id":"b","text":"Use the same strong password everywhere"},{"id":"c","text":"Use a reputable password manager"},{"id":"d","text":"Use your browser''s autofill and never change them"}]'::jsonb,
  'c',
  'A password manager generates, stores, and autofills strong unique passwords for every account. This eliminates password reuse — the biggest single risk from credential breaches.',
  3
);

-- Module 3 quiz questions
insert into public.quizzes (lesson_id, question, options, correct_answer, explanation, order_index) values
(
  'b1b2c3d4-0003-0003-0003-000000000003',
  'Someone calls claiming to be from IT and asks for your password to fix a security issue. What do you do?',
  '[{"id":"a","text":"Give them the password — they''re from IT"},{"id":"b","text":"Ask them to verify their employee ID, then give the password"},{"id":"c","text":"Hang up and call IT using their official contact number"},{"id":"d","text":"Give a fake password to test them"}]'::jsonb,
  'c',
  'Legitimate IT staff never need your password. Hanging up and calling IT''s official number independently verifies the situation without risk.',
  1
),
(
  'b1b2c3d4-0003-0003-0003-000000000003',
  'A stranger in the office follows closely behind you through a secure door before it closes. This is called:',
  '[{"id":"a","text":"Phishing"},{"id":"b","text":"Tailgating"},{"id":"c","text":"Brute forcing"},{"id":"d","text":"Spear phishing"}]'::jsonb,
  'b',
  'Tailgating (also called piggybacking) is a physical social engineering technique where an unauthorised person gains access to a restricted area by following an authorised person.',
  2
),
(
  'b1b2c3d4-0003-0003-0003-000000000003',
  'Which action best protects against social engineering attacks?',
  '[{"id":"a","text":"Using a strong password"},{"id":"b","text":"Installing antivirus software"},{"id":"c","text":"Verifying identities independently before complying with requests"},{"id":"d","text":"Enabling a VPN"}]'::jsonb,
  'c',
  'Social engineering exploits human trust, not technical vulnerabilities. Independent verification — calling back on official numbers, checking IDs — breaks the attacker''s script.',
  3
);

-- ─── Badges ──────────────────────────────────────────────────────────────────

insert into public.badges (id, name, description, icon, condition_type, condition_value) values
('c1b2c3d4-0001-0001-0001-000000000001', 'First Mission', 'Completed your first mission.', '🎯', 'mission_complete', 1),
('c1b2c3d4-0002-0002-0002-000000000002', 'Phish Buster',  'Completed the Phish Frenzy mission.', '🎣', 'mission_complete', 1),
('c1b2c3d4-0003-0003-0003-000000000003', 'Fort Knox',     'Completed the Password Fortress mission.', '🔐', 'mission_complete', 1),
('c1b2c3d4-0004-0004-0004-000000000004', 'Mind Reader',   'Completed The Human Hack mission.', '🕵️', 'mission_complete', 1),
('c1b2c3d4-0005-0005-0005-000000000005', 'Perfectionist', 'Scored 100% on any quiz.', '⭐', 'perfect_score', 100),
('c1b2c3d4-0006-0006-0006-000000000006', 'Unstoppable',   'Completed all 3 missions.', '🏆', 'mission_complete', 3);
