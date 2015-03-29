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
        var ul = document.createElement("ul")
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
    // dropdownoオブジェクトに依存してるん微妙
    $(select.dropdown.container()).find("#selected-value").html('未選択');

    return {
      // 表示の値を更新する
      update: function () {
        alert("");
      },
      show: function (node) {
        $("#selected-value").html(node);
        select.dropdown.redraw();
      }
    }
  }
};

var DropDown = {
  init: function (select){ //  draw
    var base_div = document.createElement("div"); // ベースの
    base_div.id = "dropdown-base";
    $el = $(select.el);

    $("#selected-value").on("click", function () {
      $(select.el).trigger('clicked');
    });

    var draw = function () {
      $(base_div).find("#selected-list").remove() // 初期化
      list_div = document.createElement("div"); // ベースの
      list_div.id = "selected-list";

      var reslt_list = ResultList.init(select);
      $.each($el.find("option"), function () {
        reslt_list.createLists($(this).html())
      });

      var span = document.createElement("span"); // ここじゃないほうがいい
      span.id = "selected-value";
      span.className = "currentValue";
      base_div.appendChild(span); // 表示用
      list_div.appendChild(
        reslt_list.htmledLists()
      );
      base_div.appendChild(list_div);
      this.container = base_div;
      select.el.after(this.container);
    }
    draw();

    return {
      redraw: function () {
        draw();
      },
      toggle: function () {
        $(list_div).toggle()
      },
      container: function () {
        return base_div;
      }
    }
  }
};

var VartialSelectBox = {
  init: function (select) {
    $("#selected-value").on("click", function () {
      $(select.el).trigger('clicked');
    });
    return {
    }
  }
}


// あとで名前をかえる
var Select = {
  init: function (el) {
    var self = this;
    this.el = el;
    this.dropdown = DropDown.init(this);
    this.display =  Display.init(this);
    this.vsb =      VartialSelectBox.init(this);

    $(this.el).on('clicked', this.el, function () {
      console.log("toggled");
      self.dropdown.toggle();
    });

      self.dropdown.toggle();
  }
};

$.fn.vita = function () {
  Select.init(this);
};
