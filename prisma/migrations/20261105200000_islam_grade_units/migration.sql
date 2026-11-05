-- Islam moves from one placeholder unit to a unit per grade. Students already enrolled in it move to Grade 11.
UPDATE "Unit" SET "code" = 'ISL11', "name" = 'Grade 11' WHERE "code" = 'ISL01';
