class User < ActiveRecord::Base
  # Include default devise modules.
  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :trackable, :validatable

  validates_inclusion_of :timezone,
    in: ActiveSupport::TimeZone.all.map { |tz| tz.tzinfo.name }

  include DeviseTokenAuth::Concerns::User
end
