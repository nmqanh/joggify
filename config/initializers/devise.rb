Devise.setup do |config|
  config.mailer_sender = "no-reply@joggify.herokuapp.com"

  config.reset_password_within = 1.day
end
