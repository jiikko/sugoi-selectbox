# sugoi_selectbox-rails

jQuery based replacement for select boxes.

![sugoi](https://cloud.githubusercontent.com/assets/1664497/7248919/9405f6fe-e851-11e4-8df6-252d0f948660.gif)

# Features

* Sugoi
* Lightweight

# 動作確認しているブラウザ

* Chrome(PC)
* FireFox(PC)

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'sugoi_selectbox-rails', github: 'jiikko/sugoi-selectbox-rails'
```

And then execute:

    $ bundle

Add in your javascript.js
```
//= require jquery
//= require sugoi_selectbox
```

Add in your style.css
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
