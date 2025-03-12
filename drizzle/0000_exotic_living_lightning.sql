CREATE TABLE "languages" (
	"request_id" text NOT NULL,
	"language" text NOT NULL,
	CONSTRAINT "languages_request_id_language_pk" PRIMARY KEY("request_id","language")
);
--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"l_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"l_score" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"n_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"type" text DEFAULT 'info',
	"is_read" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"r_id" text PRIMARY KEY NOT NULL,
	"requestor_id" text NOT NULL,
	"repo_url" text NOT NULL,
	"current_language" text NOT NULL,
	"status" text DEFAULT 'open',
	"tag01" text,
	"tag02" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"rv_id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"reviewer_id" text NOT NULL,
	"rating" integer,
	"comments" text,
	"reviewed_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"s_id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"translator_id" text NOT NULL,
	"pull_url" text,
	"submitted_at" timestamp with time zone DEFAULT now(),
	"status" text DEFAULT 'on review'
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"request_id" text NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "tags_request_id_tag_pk" PRIMARY KEY("request_id","tag")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"githubId" integer NOT NULL,
	"email" text,
	"username" text NOT NULL,
	"avatar" text NOT NULL,
	"total_requests" integer DEFAULT 0,
	"total_submissions" integer DEFAULT 0,
	"points" integer DEFAULT 0,
	CONSTRAINT "user_githubId_unique" UNIQUE("githubId")
);
--> statement-breakpoint
ALTER TABLE "languages" ADD CONSTRAINT "languages_request_id_requests_r_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("r_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requests" ADD CONSTRAINT "requests_requestor_id_user_id_fk" FOREIGN KEY ("requestor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_submission_id_submission_s_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("s_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_request_id_requests_r_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("r_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_translator_id_user_id_fk" FOREIGN KEY ("translator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_request_id_requests_r_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("r_id") ON DELETE no action ON UPDATE no action;