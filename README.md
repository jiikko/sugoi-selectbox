# SugoiSelectbox::Rails

jQuery based replacement for select boxes.

# Features

* Sugoi

# 動作確認しているブラウザ

* Chrome
* FireFox

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'sugoi_selectbox-rails', github: 'jiikko/sugoi-selectbox-rails'
```

And then execute:

    $ bundle

### Include javascript assets
Add the following to your app/assets/javascripts/application.js:
```
//= require jquery
//= require sugoi_selectbox
```

### Include stylesheet assets
Add to your app/assets/stylesheets/application.css:
```
//= require sugoi_selectbox
```

## Usage

```javascript
$("#select").suguiSelectbox()
```

## Contributing

1. Fork it ( https://github.com/[my-github-username]/sugoi_selectbox-rails/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
