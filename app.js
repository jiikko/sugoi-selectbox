var ResultList = {
  init: function (select) {
    var lists = [];
    return {
      createLists: function (value) {
        var li = document.createElement("li");
        li.innerHTML = value;
        // li.addEventListener("click", function() {
        $(li).click(function(e) {
          console.log("ok click");
          $(this).remove();
          select.display.show(this);
          $(select.el).trigger('clicked');
        });
        lists.push(li);
      },
      htmledLists: function() {
        var ul = document.createElement("ul");
        lists.forEach(function(v){
          ul.appendChild(v);
        });
        return ul;
      }
    }
  }
}

var Display = {
  init: function (select) {
    var $container = $(select.dropdown.container())
    // dropdownoオブジェクトに依存してるん微妙
    $container.find("[data-selected-value]").html('未選択');

    return {
      show: function (node) {
        $container.find("[data-selected-value]").html(node);
        select.dropdown.redraw();
      }
    }
  }
};

var DropDown = {
  init: function (select){ //  draw
    var $el = $(select.el);
    var base_div = new String +
      "<div data-selected-base=''>"   +
        "<span class=currentValue data-selected-value></span>"   +
        "<div data-selected-list=''>" +
        "</div>"                      +
      "</div>";
    $base_div = $(base_div);
    var list_div = $base_div.find("[data-selected-list]");

    $base_div.find(".currentValue").on("click", function () {
      console.log("clicked currentvalue");
      $(select.el).trigger('clicked');
    });

    var draw = function () {
      $base_div.find("[data-selected-list] ul").remove()
      var reslt_list = ResultList.init(select);
      $.each($el.find("option"), function () {
        reslt_list.createLists($(this).html())
      });
      list_div.append(
        reslt_list.htmledLists()
      );
    }
    draw();
    select.el.after($base_div);

    return {
      redraw: function () {
        draw()
      },
      toggle: function () {
        console.log("toggled list");
        $(list_div).toggle()
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
