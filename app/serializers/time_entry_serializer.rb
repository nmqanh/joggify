class TimeEntrySerializer < ActiveModel::Serializer
  attributes :id, :date, :distance_in_kilometres,
    :duration_in_minutes, :updated_at, :created_by_name

  def created_by_name
    "#{object.user.name} - #{object.user.email}"
  end
end
