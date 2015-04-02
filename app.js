(function ($) {
  var KEY, ResultList, Select, Selectionm, Container, SearchField;

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

  Container = new String                                         +
        "<div data-selected-base>"                               +
          "<span class=currentValue data-selected-value></span>" +
          "<div data-dropdown>"                                  +
            "<input type='text'>"                                +
            "<div data-selected-list></div>"                     +
          "</div>"                                               +
        "</div>";

  Selection = {
    init: function (select) {
      var $container = select.$container;

      return {
        getIndex: function () {
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
        clear: function (index) {
          $container.find("li").removeClass("highlight");
        },
        set: function (index) {
          $container.find("li").each(function (i, item) {
            if(i === index) {
              $(item).addClass("highlight");
            } else {
              $(item).removeClass("highlight");
            }
          });
        },
        enter: function () {
          if(this.getIndex() !== undefined) {
            li = $container.find("li").get(this.getIndex());
            li.click();
          }
        },
        setDefaulte: function () {
          var currentvalue = $container.find("span").html();
          if(currentvalue) {
              $container.find("li").each(function (i, item) {
                if(currentvalue == $(item).html()) {
                  select.selection.set(i);
                  return;
                }
              });
          }
        }
      }
    }
  }

  SearchField = {
    init: function (select, resultList) {
      var $container = select.$container;

      $container.find("input").on("keyup", function (e) {
        if (
          e.which >= 48             ||
          e.which === KEY.SPACE     ||
          e.which === KEY.BACKSPACE ||
          e.which === KEY.DELETE
        ) {
          resultList.update($(this).val());
        }
      });

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
      }
    }
  }

  ResultList = {
    init: function (select) {
      var self = this;
      var lists = [];
      var currentIndex = 0;
      var $container = select.$container;
      var add = function (value) {
        var $li = $("<li>");
        $li.html(value);
        $li.hover(
            function () {
              var self = this;
              $container.find("li").each(function (i, item) {
                if(self == item) {
                  select.selection.set(i);
                  return;
                }
              });
            }, function () {
              select.selection.clear();
            }
            );
        $li.click(function(e) {
          $(this).remove();
          select.display.show(this);
          select.el.trigger('clickedList');
        });
        lists.push($li);
      };

      return {
        htmledLists: function() {
          var $ul = $("<ul>");
          $.each(lists, function(i, item){
            $ul.append(item);
          });
          return $ul;
        },
        clear: function () {
          lists = [];
        },
        update: function (query) {
          this.createList(query);
        },
        initSearchField: function () {
          return SearchField.init(select, this);
        }
        ,
        createList: function (query) {
          this.clear();
          $container.find("[data-selected-list] ul").remove();
          $.each(select.el.find("option"), function () {
            $li = $(this);
            if((new RegExp(query)).test($li.html())) {
              add($(this).html());
            }
          });
          $container.find("[data-selected-list]").append(
            this.htmledLists()
          );
        }
      }
    }
  }

  var Display = {
    init: function (select) {
      var $container = select.$container;
      var $selectedValue = $container.find("[data-selected-value]");
      $selectedValue.html('未選択'); // 初期化

      return {
        show: function (node) {
          $selectedValue.html($(node).html());
          select.dropdown.createList();
        }
      }
    }
  };

  var DropDown = {
    init: function (select){ //  draw
      var $el = $(select.el);
      var $container = select.$container;
      var current_value_span = $container.find("[data-selected-value]");
      var $dropdown_div = $container.find("[data-dropdown]");
      var reslt_list = ResultList.init(select);
      reslt_list.initSearchField();

      current_value_span.on("click", function () {
        $(select.el).trigger('clickedList');
      });
      reslt_list.createList();

      return {
        createList: function () {
          reslt_list.createList()
        },
        toggle: function () {
          console.log("toggled list");
          $dropdown_div.toggle();
          if(this.isOpen) {
            select.selection.setDefaulte()
            $dropdown_div.find("input").select();
          }
        },
        isOpen: function () {
          return $dropdown_div.is(':visible')
        }
      }
    }
  };

  // あとで名前をかえる
  Select = {
    init: function (el) {
      var self = this;
      this.el = $(el);
      this.el.hide();
      this.el.after(Container);
      this.$container = $(this.el.next());
      this.selection = Selection.init(this);
      this.dropdown = DropDown.init(this);
      this.display =  Display.init(this);

      this.el.on('clickedList', this.el, function () {
        self.dropdown.toggle();
      });
      this.dropdown.toggle();
    }
  };

  $.fn.suguiSelectbox = function () {
    Select.init(this);
  };
}(jQuery));
