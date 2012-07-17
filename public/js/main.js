/**
 * @author Michal Cierniak
 */


// Models
window.Camp = Backbone.Model.extend({
	  urlRoot: "/api/camps",
    defaults:{
        id: null,
        name: ''
    }
});

window.CampCollection = Backbone.Collection.extend({
    model:Camp,
    url:"/api/camps"
});

window.CampListView = Backbone.View.extend({

    tagName:'ul',

    initialize:function () {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function (camp) {
            $(self.el).append(new CampListItemView({model: camp}).render().el);
        });
    },

    render:function (eventName) {
    	  console.log('ListView.render');
        _.each(this.model.models, function (camp) {
            $(this.el).append(new CampListItemView({model: camp}).render().el);
        }, this);
        return this;
    }

});


// Views
window.CampListItemView = Backbone.View.extend({

    tagName: "li",

    template: jadeTemplates.camp_list_item,
    
    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function (eventName) {
    	  console.log('list item: ' + JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    close:function () {
        $(this.el).unbind();
        $(this.el).remove();
    }

});

window.CampView = Backbone.View.extend({

    template: jadeTemplates.camp_details,


    initialize:function () {
        this.model.bind("change", this.render, this);
    },
    
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events:{
        "change input": "change",
        "click .save": "saveCamp",
        "click .delete": "deleteCamp"
    },

    change:function (event) {
        var target = event.target;
        console.log('changing ' + target.id + ' from: ' + target.defaultValue + ' to: ' + target.value);
        // You could change your model on the spot, like this:
        // var change = {};
        // change[target.name] = target.value;
        // this.model.set(change);
    },

    saveCamp: function () {
        this.model.set({
            name:$('#name').val()
        });
        if (this.model.isNew()) {
            app.campList.create(this.model);
        } else {
            this.model.save();
        }
        return false;
    },

    deleteCamp: function () {
        this.model.destroy({
            success:function () {
                alert('Camp deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

    close:function () {
        $(this.el).unbind();
        $(this.el).empty();
    }
});


window.HeaderView = Backbone.View.extend({

    template: jadeTemplates.header,

    initialize: function () {
        this.render();
    },

    render: function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "click .new": "newCamp"
    },

    newCamp: function (event) {
        if (app.campView) app.campView.close();
        app.campView = new CampView({model: new Camp()});
        $('#content').html(app.campView.render().el);
        return false;
    }
});

// Router
var AppRouter = Backbone.Router.extend({

    routes: {
        "":"list",
        "camps/:id":"campDetails"
    },

    initialize: function () {
        $('#header').html(new HeaderView().render().el);
    },

    list: function () {
        this.campList = new CampCollection();
        this.campListView = new CampListView({model:this.campList});
        this.campList.fetch();
     	  console.log('setting sidebar');
     	  var listHtml = this.campListView.render().el;
     	  console.log('setting sidebar, listHtml: ' + listHtml);
        $('#sidebar').html(listHtml);
    },

    campDetails: function (id) {
     	  console.log('campDetails, id: ' + id);
        this.camp = this.campList.get(id);
        this.campView = new CampView({model:this.camp});
        $('#content').html(this.campView.render().el);
    }
});

var app;

function myMain() {
  console.log('hello my main');
  var foo = jadeTemplates.header();
  //$('#area1').html(foo);
  var campListItem = jadeTemplates.camp_list_item({name: 'YMCA', id: 'c0001'});
  //$('#area1').html(campListItem);
  var campDetails = jadeTemplates.camp_details({name: 'YMCA', id: 'c0001'});
  //$('#area1').html(campDetails);

  app = new AppRouter();
  Backbone.history.start();
}
