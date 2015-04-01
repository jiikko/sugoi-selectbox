(function ($) {
  var KEY, ResultList, Select, Selection;

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

  Selection = {
    init: function (select) {
      var $container = $(select.container);

      return {
        getIndex: function () { // private でいける?:
          var index;
          $container.find("li").each(function (i, item) {
            if($(item).hasClass("highlight")) {
              index = i;
            }
          })
          return index;
        },
        move: function (relative_position) {
          var current = this.getIndex() + relative_position;
          var move_to_position = 0
            if(current > 0) {
              move_to_position = current;
            }
          console.log(move_to_position);
          this.set(move_to_position);
        },
        set: function (index) {
          $container.find("li").each(function (i, item) {
            if(i == index) {
              $(item).addClass("highlight");
            } else {
              $(item).removeClass("highlight");
            }
          });
        },
        enter: function () {
          li = $container.find("li").get(this.getIndex());
          li.click();
        }
      }
    }
  }

  ResultList = {
    init: function (select) {
      var self = this;
      var lists = [];
      var currentIndex = 0;
      var $container = $(select.container);

      $container.find("input").on("keyup", function (e) {
        switch (e.which) {
          case KEY.ENTER:
            select.selection.enter();
          case KEY.UP:
            select.selection.move(-1);
            return;
          case KEY.DOWN:
            select.selection.move(1);
        return;
        };
      });

      return {
        createLists: function (value) {
          var $li = $("<li>");
          $li.html(value);
          $li.hover( // ???????????
            function () {
              console.log("in" + this);
            }, function () {
              console.log("out" + this);
            }
          );
          $li.click(function(e) {
            $(this).remove();
            select.display.show(this);
            select.el.trigger('clicked');
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
        clear: function () {
          lists = [];
        }
      }
    }
  }

  var Display = {
    init: function (select) {
      var $container = $(select.container);
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
      var $container = $(select.container);
      var list_div = $container.find("[data-selected-list]");
      var current_value_span = $container.find("[data-selected-value]");
      var dropdown_div = $container.find("[data-dropdown]");
      var reslt_list = ResultList.init(select);

      current_value_span.on("click", function () {
        console.log("clicked currentvalue");
        $(select.el).trigger('clicked');
      });

      var draw = function () {
        reslt_list.clear();
        $container.find("[data-selected-list] li").remove();

        $.each(select.el.find("option"), function () {
          reslt_list.createLists($(this).html());
        });
        list_div.append(
          reslt_list.htmledLists()
        );
      }
      draw();

      return {
        redraw: function () {
          draw();
        },
        toggle: function () {
          console.log("toggled list");
          $(dropdown_div).toggle();
          $(dropdown_div).find("input").select();
        },
      }
    }
  };

  // あとで名前をかえる
  Select = {
    init: function (el) {
      var self = this;
      this.el = $(el);
      this.el.hide();
      var container = new String                                   +
        "<div data-selected-base>"                                 +
          "<span class=currentValue data-selected-value></span>"   +
          "<div data-dropdown>"                                    +
            "<input type='text'>"                                  +
            "<div data-selected-list></div>"                       +
          "</div>"                                                 +
        "</div>";
      this.el.after(container);
      this.container = this.el.next();

      this.selection = Selection.init(this);
      this.dropdown = DropDown.init(this);
      this.display =  Display.init(this);

      this.el.on('clicked', this.el, function () {
        self.dropdown.toggle();
      });
      this.dropdown.toggle();
    }
  };

  $.fn.suguiSelectbox = function () {
    Select.init(this);
  };
}(jQuery));
