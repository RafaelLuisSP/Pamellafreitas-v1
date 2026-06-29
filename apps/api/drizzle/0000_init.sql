-- Migration inicial - Pamella Freitas (anamnese infantil online)
CREATE TABLE `guardians` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password_hash` text NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guardians_email_unique` ON `guardians` (`email`);
--> statement-breakpoint
CREATE TABLE `consents` (
  `id` text PRIMARY KEY NOT NULL,
  `guardian_id` text NOT NULL,
  `type` text NOT NULL,
  `granted` integer NOT NULL,
  `version` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`guardian_id`) REFERENCES `guardians`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_consents_guardian` ON `consents` (`guardian_id`);
--> statement-breakpoint
CREATE TABLE `children` (
  `id` text PRIMARY KEY NOT NULL,
  `guardian_id` text NOT NULL,
  `name` text NOT NULL,
  `birthdate` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`guardian_id`) REFERENCES `guardians`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_children_guardian` ON `children` (`guardian_id`);
--> statement-breakpoint
CREATE TABLE `anamnese_sessions` (
  `id` text PRIMARY KEY NOT NULL,
  `child_id` text NOT NULL,
  `status` text DEFAULT 'draft' NOT NULL,
  `current_group` integer DEFAULT 1 NOT NULL,
  `submitted_at` integer,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `anamnese_sessions_child_id_unique` ON `anamnese_sessions` (`child_id`);
--> statement-breakpoint
CREATE TABLE `anamnese_answers` (
  `id` text PRIMARY KEY NOT NULL,
  `session_id` text NOT NULL,
  `question_id` text NOT NULL,
  `value` text NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`session_id`) REFERENCES `anamnese_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_answer` ON `anamnese_answers` (`session_id`,`question_id`);
--> statement-breakpoint
CREATE INDEX `idx_answers_session` ON `anamnese_answers` (`session_id`);
