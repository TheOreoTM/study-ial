-- Dhivehi was dropped from the curriculum. Its unit and student enrolments go with it through ON DELETE CASCADE.
DELETE FROM "Subject" WHERE "slug" = 'dhivehi';
