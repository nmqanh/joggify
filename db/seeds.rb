puts "Seed generating..."
User.create(
  name: "Bob Admin",
  email: "bob.admin@joggify.herokuapp.com",
  password: "bob.admin",
  timezone: "Australia/Brisbane",
  role: "admin"
)

User.create(
  name: "Alice Manager",
  email: "alice.manager@joggify.herokuapp.com",
  password: "alice.manager",
  timezone: "America/Los_Angeles",
  role: "manager"
)

User.create(
  name: "Carol User",
  email: "carol.user@joggify.herokuapp.com",
  password: "carol.user",
  timezone: "America/New_York",
  role: "user"
)

20.times do |_|
  u = User.create(
    name: Faker::Name.name,
    email: Faker::Internet.email,
    password: "p@ssw0rd",
    timezone: "Australia/Brisbane",
    role: "user"
  )
end

Time.zone = ActiveSupport::TimeZone["Brisbane"]
r = Random.new

(60.days.ago.to_date..Date.today).map do |d|
  User.all.each do |user|
    is_jogging = r.rand(2)
    if is_jogging == 1
      distance = Faker::Number.between(10, 50)
      duration = Faker::Number.between(100, 400)
      avg = distance * 60 / duration
      while avg < 5 || avg > 20
        distance = Faker::Number.between(10, 50)
        duration = Faker::Number.between(100, 400)
        avg = distance * 60 / duration
      end
      user.time_entries.create(
        distance_in_kilometres: distance,
        duration_in_minutes: duration,
        date: d.to_s
      )
    end
  end
end
puts "Seed generating succesully!"
