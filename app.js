(function ($) {
  var KEY, ResultList, Select, Selectionm, Container, SearchField, HiddenField;

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
          "<div class='data-sugoi-selectbox-close' data-sugoi-selectbox-top>" +
            "<span class=currentValue data-sugoi-selectbox-current-value></span>" +
            "<b></b>" +
          "</div>" +
          "<div data-sugoi-selectbox-dropdown>" +
            "<input type='text' autocomplete='off'>" +
            "<div data-sugoi-selectbox-list></div>" +
          "</div>" +
          "<input type='hidden'>" +
        "</div>";

  Selection = {
    init: function (select) {
      var $container = select.$container;
      var lists = function () {
        return $container.find("li");
      };

      return {
        isOver: function (relative_position) {
          var next_position = this.getIndex() + relative_position;
          if(
              lists().length <= next_position ||
              next_position < 0
            ) {
              return true;
          }
        },
        getIndex: function () {
          var index;
          lists().each(function (i, item) {
            if($(item).hasClass("sugoi-highlight")) {
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
          this.set(move_to_position);
        },
        clear: function (index) {
          lists().removeClass("sugoi-highlight");
        },
        get: function () {
          return $(lists().get(this.getIndex()));
        },
        set: function (index) {
          this.clear();
          $activeList = $(lists().get(index));
          $activeList.addClass("sugoi-highlight");
          $(select.el).trigger("scrollToSelecting");
        },
        choose: function () {
          if(this.getIndex() !== undefined) {
            li = lists().get(this.getIndex());
            li.click();
          }
        },
        setDefault: function () {
          if($(lists()[0]).data("role") === "blank") {
            return;
          }

          var currentvalue = $container.find("span").html();
          var is_finded;
          if(currentvalue) {
            lists().each(function (i, item) {
              if(currentvalue === $(item).html()) {
                select.selection.set(i);
                is_finded = true;
                return false;
              }
            });
            if(!is_finded) { this.set(0); }
          }
        }
      }
    }
  }

  HiddenField = {
    init: function (select) {
      var $container = select.$container;
      var $hiddenField = $container.find("input[type=hidden]");
      $hiddenField.attr("name", select.el.attr("name"));

      return {
        set: function () {
          $container.find("input[type=hidden]").val(
            $container.find("[data-sugoi-selectbox-current-value]").attr("data-id")
          );
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
          e.which === KEY.DELETE    ||
          e.which === KEY.ENTER     ||
          e.which === KEY.LEFT      ||
          e.which === KEY.RIGHT
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
      var add = function (obj) {
        var $li = $("<li>");
        $li.html(obj.name);
        $li.attr("data-id", obj["data-id"]);
        lists.push($li);
      };

      $container.on("click", "li", function (e) {
        $listItem = $(e.target)
        $listItem.remove();
        select.display.show($listItem);
        select.el.trigger('clickedList');
      });

      $container.on("mouseenter", "li", function (e) {
        var self = this;
        $container.find("li").each(function (i, item) {
          if(self == item) {
            select.selection.set(i);
            return;
          }
        });
      }).on("mouseleave", "li", function (e) {
        select.selection.clear();
      });

      return {
        htmledLists: function() {
          var $ul = $("<ul>");
          $.each(lists, function(i, item){
            $ul.append(item);
          });
          if($ul.find("li").length == 0) {
            var $li = $("<li>");
            $li.attr("data-role", "blank");
            $li.html("No matches found");
            $ul.append($li);
          }
          return $ul;
        },
        clear: function () {
          lists = [];
        },
        result: function () {
          return $container.find("ul");
        },
        update: function () {
          var query = $container.find("input").val();
          this.createList(query);
          select.selection.setDefault();
        },
        initSearchField: function () {
          return SearchField.init(select, this);
        },
        createList: function (query) {
          this.clear();
          $container.find("[data-sugoi-selectbox-list] ul").remove();
          $.each(select.el.find("option"), function () {
            $li = $(this);
            if($li.html() === '') { return true; }
            if((new RegExp(query)).test($li.html())) {
              add(
                { "data-id": $li.val(), "name": $li.html() }
              );
            }
          });
          $container.find("[data-sugoi-selectbox-list]").append(
            this.htmledLists()
          );
        },
        scrollToSelecting: function (selection) {
          var listYWithAmariY = selection.get().offset().top + selection.get().outerHeight();
          var listY = this.result().offset().top + this.result().outerHeight();
          var amriY = listYWithAmariY - listY;

          // down
          if(amriY > 0) {
            this.result().scrollTop(
              this.result().scrollTop() + amriY
            );
          }

          // up
          var y = selection.get().offset().top - this.result().offset().top;
          if(y < 0) {
            this.result().scrollTop(
              this.result().scrollTop() + y
            );
          }
        },
      }
    }
  }

  var Display = {
    init: function (select) {
      var $container = select.$container;
      var $selectedValue = $container.find("[data-sugoi-selectbox-current-value]");
      var selectorEscape = function (val) {
        return val.replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');
      };

      (function () {
        var id = select.el.find("option:selected").val();
        if(id) {
          var name = select.$container.find("li[data-id=" + selectorEscape(id) + "]").html();
          $selectedValue.html(name);
        } else {
          $selectedValue.html('未選択');
        }
      })();

      (function () {
        var width = $container.find("ul").outerWidth();
        width+= 30;
        $container.css({ "width": width });
      })();

      return {
        show: function (node) {
          var $node = $(node);
          $selectedValue.html($node.html());
          $selectedValue.attr("data-id", $node.attr("data-id"));
          select.dropdown.createList();
          select.hiddenField.set();
        }
      }
    }
  };

  var DropDown = {
    init: function (select){ //  draw
      var $el = $(select.el);
      var $container = select.$container;
      var $dropdown_div = $container.find("[data-sugoi-selectbox-dropdown]");
      select.resultList.initSearchField();

      $container.find("[data-sugoi-selectbox-top]").on("click", function () {
        $(select.el).trigger('clickedList');
      });
      select.resultList.createList();

      (function () {
        var isHover = true;
        $(select.$container).hover(function () {
          isHover = true;
        }, function () {
          isHover = false;
        });
        $(document).on('mouseup', function () {
          if(!isHover) {
            $(select.el).trigger("canceled");
          }
        });
      })();

      return {
        createList: function () {
          select.resultList.createList();
        },
        toggle: function () {
          var topNode = $container.find("[data-sugoi-selectbox-top]");
          $dropdown_div.toggle();
          if(this.isOpen()) {
            select.selection.setDefault();
            select.resultList.update();
            $dropdown_div.find("input").select();
            topNode.removeClass("data-sugoi-selectbox-close");
          } else {
            topNode.addClass("data-sugoi-selectbox-close");
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
      this.el = $(el);
      this.el.hide();
      this.el.after(Container);
      this.$container = $(this.el.next());
      this.hiddenField = HiddenField.init(this);
      this.selection = Selection.init(this);
      this.resultList = ResultList.init(this);
      this.dropdown = DropDown.init(this);
      this.display =  Display.init(this);

      var self = this;
      this.el.on('clickedList canceled', this.el, function () {
        self.dropdown.toggle();
      });
      this.dropdown.toggle();

      this.el.on('scrollToSelecting', this.el, function () {
        self.resultList.scrollToSelecting(self.selection);
      });
    }
  };

  $.fn.suguiSelectbox = function () {
    Select.init(this);
  };
}(jQuery));
