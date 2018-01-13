# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!

# Jbuilder name convention
Jbuilder.key_format camelize: :lower
