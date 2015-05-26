links = new Mongo.Collection("links");
Comments = new Mongo.Collection("comments");


Router.route('/users/:username', function() {
  this.render('userView');
},{
    name: 'user'
});

Router.route('/', function () {
    this.render('linksList');
},{
    name:'links.all'
});

Router.route('/links/add', function () {
    this.render('addlinks');
},{
    name: 'links.add'
});

Router.route('/links/:title', function () {
    this.render('linksView', {
        data: function () {
            return links.findOne({urlTitle: this.params.title});
        }
    });
},{
    name: 'links.single'
});


  Meteor.methods({
    addlinks: function (title,url) {
        links.insert({
            username: Meteor.user().username,
            title: title,
            url:url,
            urlTitle:title.replace(/\s/g,'-'), //remove spaces
            dateAdded: new Date(),
            moment: function() { return moment().format("ddd, hA") },
        });
    },
    addComment: function(comment, userId) {
      Comments.insert({
        username: Meteor.user().username,
        owner: userId,
        comment:comment,
        dateAdded: new Date(),
        moment: moment().format("ddd, hA")
      });
    },
    deleteComment: function(e) {
      console.log(e)
      var userId = e.userId;

      Comments.remove(userId)
      }
  });


if (Meteor.isClient) {


Template.registerHelper('isCurrentUser', function(owner) {
  console.log(owner)
  return owner === Meteor.userId();
});


  Template.linksView.helpers({
    getComments: function() {
        return Comments.find({},{sort: {dateAdded: -1}});
    },
     isOwner: function() {
        return this.userId === Meteor.userId();
    },
  });


  Template.linksView.events({
    'submit .addCommentsForm':function(e){
      if (!Meteor.userId()) {
        alert("You must log in to leave comments!")
        return;
      }
          e.preventDefault();
          var userId = Meteor.userId()
          var comments = e.target.comments.value;
          Meteor.call('addComment', comments, userId);
    },
      'click button':function(e) {
          var userId = e.owner;
          console.log(userId)
        Meteor.call('deleteComment', e)
      }
  });

  Template.addlinks.events({
    'submit .addlinksForm':function(e){

           var title = e.target.title.value;
           var url= e.target.url.value; 

           if(!title || !url){
               return false;
           }

           Meteor.call('addlinks',title,url); 
           Router.go('links.all');

           return false;
       },
      'click .badge no-style':function(e){

        Meteor.call('deletelinks')
      }
    });

    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY",
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

//Config accounts to only accept usernames


