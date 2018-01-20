FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    timezone "Australia/Brisbane"
    password { Faker::Internet.password(10, 20) }
    name { Faker::Name.name }
    role :user

    factory :admin_user do
      role :admin
    end

    factory :manager_user do
      role :manager
    end
  end
end
