-- Store requester contact for plan/add-on workflow emails
alter table producer_plan_requests
  add column if not exists requester_email text;

comment on column producer_plan_requests.requester_email is
  'Email of producer account at request time, used for approval/rejection notifications.';
