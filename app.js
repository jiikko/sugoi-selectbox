(function ($) {
  var KEY, ResultList, Select, Selectionm, Container, SearchField;

  KEY = {
      TAB:        9,
      ENTER:     13,
      ESC:       27,
      SPACE:     32,
      LEFT:      37,
      UP:        38,
      RIGHT:     39,
      DOWN:      40,
      SHIFT:     16,
      CTRL:      17,
      ALT:       18,
      PAGE_UP:   33,
      PAGE_DOWN: 34,
      HOME:      36,
      END:       35,
      BACKSPACE:  8,
      DELETE:    46
  };

  Container = new String +
        "<div data-sugoi-selectbox>" +
          "<span class=currentValue data-sugoi-selectbox-current-value></span>" +
          "<div data-sugoi-selectbox-dropdown>" +
            "<input type='text' autocomplete='off'>" +
            "<div data-sugoi-selectbox-list></div>" +
          "</div>" +
        "</div>";

  Selection = {
    init: function (select) {
      var $container = select.$container;

      return {
        isOver: function (relative_position) {
          var next_position = this.getIndex() + relative_position;
          if(
              $container.find("li").length <= next_position ||
              next_position < 0
            ) {
              return true;
          }
        },
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
        choose: function () {
          if(this.getIndex() !== undefined) {
            li = $container.find("li").get(this.getIndex());
            li.click();
          }
        },
        setDefault: function () {
          var currentvalue = $container.find("span").html();
          var is_finded;
          if(currentvalue) {
            $container.find("li").each(function (i, item) {
              if(currentvalue == $(item).html()) {
                select.selection.set(i);
                is_finded = true;
                return;
              }
            });
            if(!is_finded) { this.set(0); }
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
          resultList.update();
        }
      });

      $container.find("input").on("keydown", function (e) {
        switch (e.which) {
          case KEY.TAB:
            select.selection.choose();
            return;
          case KEY.ENTER:
            e.preventDefault();
            select.selection.choose();
            return;
          case KEY.UP:
            if(select.selection.isOver(-1)) { return; }
            select.selection.move(-1);
            return;
          case KEY.DOWN:
            if(select.selection.isOver(1)) { return; }
            select.selection.move(1);
            return;
          case KEY.ESC:
            $(select.el).trigger("canceled");
            return;
        };
      });
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
          if($ul.find("li").length == 0) {
            var $li = $("<li>");
            $li.html("No matches found");
            $ul.append($li);
          }
          return $ul;
        },
        clear: function () {
          lists = [];
        },
        update: function () {
          var query = $container.find("input").val()
          this.createList(query);
          select.selection.setDefault();
        },
        initSearchField: function () {
          return SearchField.init(select, this);
        }
        ,
        createList: function (query) {
          this.clear();
          $container.find("[data-sugoi-selectbox-list] ul").remove();
          $.each(select.el.find("option"), function () {
            $li = $(this);
            if((new RegExp(query)).test($li.html())) {
              add($(this).html());
            }
          });
          $container.find("[data-sugoi-selectbox-list]").append(
            this.htmledLists()
          );
        }
      }
    }
  }

  var Display = {
    init: function (select) {
      var $container = select.$container;
      var $selectedValue = $container.find("[data-sugoi-selectbox-current-value]");
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
      var $dropdown_div = $container.find("[data-sugoi-selectbox-dropdown]");
      var resultList = ResultList.init(select);
      resultList.initSearchField();

      $container.find("[data-sugoi-selectbox-current-value]").on("click", function () {
        $(select.el).trigger('clickedList');
      });
      resultList.createList();
      (function () {
        var isHover = true;
        $(select.$container).hover(function () {
          isHover = true;
        }, function () {
          isHover = false;
        });
        $(document).on('mouseup', function () {
          if(!isHover) {
            $dropdown_div.hide();
          }
        });
      })();

      return {
        createList: function () {
          resultList.createList();
        },
        toggle: function () {
          console.log("toggled list");
          $dropdown_div.toggle();
          if(this.isOpen()) {
            select.selection.setDefault();
            resultList.update();
            $dropdown_div.find("input").select();
          }
        },
        isOpen: function () {
          return $dropdown_div.is(':visible');
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

      this.el.on('clickedList canceled', this.el, function () {
        self.dropdown.toggle();
      });
      this.dropdown.toggle();
    }
  };

  $.fn.suguiSelectbox = function () {
    Select.init(this);
  };
}(jQuery));
