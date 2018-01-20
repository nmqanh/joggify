FactoryBot.define do
  factory :time_entry do
    distance_in_kilometres { Faker::Number.between(1, 30) }
    duration_in_minutes { Faker::Number.between(100, 500) }
    date { Faker::Date.between(30.days.ago, Date.today) }
    user { create :user }
  end
end
