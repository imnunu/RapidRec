template1=# CREATE ROLE labber WITH LOGIN password '';
CREATE ROLE
template1=# CREATE DATABASE final OWNER labber;
CREATE DATABASE
template1=#

db port: 5432



            <% if (profile.user_games.games.start_time < Date.now() ) { %>
              <% for (let past of profile.user_games.games) { %>
<%= past.title %>
<i class="fa fa-clock-o" aria-hidden="true"></i> <%= timeInHrsMinutes(Date.now) - timeInHrsMinutes(past.start_time) minutes ago %>42 minutes ago</i></a></small></small></h4>


let tooLong = gameLimitExceeded(r.start_time, r.end_time);

what time is in: ISO 8601
