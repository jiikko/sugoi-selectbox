KEY = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46
};

var ResultList = {
  init: function (select, dropdown_div) {
    var self = this;
    var lists = [];
    var currentIndex = 0;

    this.getSelectionIndex = function () {
      var index;
      dropdown_div.find("li").each(function (i, item) {
        if($(item).hasClass("highlight")) {
          index = i;
        }
      })
      return index;
    };

    this.moveSelection = function (relative_position) {
      var current = this.getSelectionIndex() + relative_position;
      var move_to_position = 0
      if(current > 0) {
        move_to_position = current;
      }
      console.log(move_to_position);
      this.setSelection(move_to_position);
    };

    this.setSelection = function (index) {
      dropdown_div.find("li").each(function (i, item) {
        if(i == index) {
          $(item).addClass("highlight");
        } else {
          $(item).removeClass("highlight");
        }
      });
    };

    this.enter = function () {
      li = dropdown_div.find("li").get(this.getSelectionIndex());
      li.click();
    };

    dropdown_div.find("input").on("keyup", function (e) {
      console.log(e.which);
      switch (e.which) {
        case KEY.ENTER:
          self.enter();
        case KEY.UP:
          self.moveSelection(-1);
          return;
        case KEY.DOWN:
          self.moveSelection(1);
      return;
      };
    });

    return {
      createLists: function (value) {
        var $li = $("<li>");
        $li.html(value);
        // li.addEventListener("click", function() {
        $li.click(function(e) {
          console.log("ok click");
          $(this).remove();
          select.display.show(this);
          $(select.el).trigger('clicked');
        });
        lists.push($li);
      },
      htmledLists: function() {
        var $ul = $("<ul>");
        $.each(lists, function(i, item){
          $ul.append(item);
        });
        return $ul;
      },
    }
  }
}

var Display = {
  init: function (select) {
    // dropdownoオブジェクトに依存してるん微妙
    var $container = select.dropdown.container();
    var $selectedValue = $container.find("[data-selected-value]");
    $selectedValue.html('未選択'); // 初期化

    return {
      show: function (node) {
        $selectedValue.html($(node).html());
        select.dropdown.redraw();
      }
    }
  }
};

var DropDown = {
  init: function (select){ //  draw
    var $el = $(select.el);
    var base_div = new String                                  +
      "<div data-selected-base>"                               +
        "<span class=currentValue data-selected-value></span>" +
        "<div data-dropdown>"                                  +
          "<input type='text'>"                                +
          "<div data-selected-list></div>"                     +
        "</div>"                                               +
      "</div>";
    var $base_div = $(base_div);
    var list_div = $base_div.find("[data-selected-list]");
    var dropdown_div = $base_div.find("[data-dropdown]");
    var current_value_span = $base_div.find("[data-selected-value]");

    current_value_span.on("click", function () {
      console.log("clicked currentvalue");
      $(select.el).trigger('clicked');
    });

    var draw = function () {
      $base_div.find("[data-selected-list] ul").remove();
      var reslt_list = ResultList.init(select, dropdown_div);
      $.each($el.find("option"), function () {
        reslt_list.createLists($(this).html());
      });
      list_div.append(
        reslt_list.htmledLists()
      );
    }
    draw();
    select.el.after($base_div);

    return {
      redraw: function () {
        draw();
      },
      toggle: function () {
        console.log("toggled list");
        $(dropdown_div).toggle();
        $(dropdown_div).find("input").select();
      },
      container: function () {
        return $base_div;
      }
    }
  }
};


// あとで名前をかえる
var Select = {
  init: function (el) {
    var self = this;
    this.el = el;
    $(el).hide();

    this.dropdown = DropDown.init(this);
    this.display =  Display.init(this);

    $(this.el).on('clicked', this.el, function () {
      self.dropdown.toggle();
    });
    self.dropdown.toggle();
  }
};

$.fn.suguiSelectbox = function () {
  Select.init(this);
};
