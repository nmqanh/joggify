class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :timezone, :role, :label

  def label
    "#{object.name} - #{object.email}"
  end
end
