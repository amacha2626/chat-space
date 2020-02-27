Rails.application.routes.draw do
  get 'massages/index'

  root "massages#index"
end
