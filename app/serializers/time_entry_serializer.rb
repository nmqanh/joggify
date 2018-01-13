class TimeEntrySerializer < ActiveModel::Serializer
  attributes :id, :date, :distance_in_kilometres,
    :duration_in_minutes, :updated_at
end
