News = new Mongo.Collection("news");
Comments = new Mongo.Collection("comments");

Router.route('/', function () {
    this.render('newsList');
},{
    name:'news.all'
});

Router.route('/news/add', function () {
    this.render('addNews');
},{
    name: 'news.add'
});

Router.route('/news/:title', function () {
    this.render('newsView', {
        data: function () {
            return News.findOne({urlTitle: this.params.title});
        }
    });
},{
    name: 'news.single'
});

console.log(Meteor.userID);

  Meteor.methods({
    addNews: function (title,url) {
        News.insert({
            title: title,
            url:url,
            urlTitle:title.replace(/\s/g,'-'), //remove spaces
            dateAdded:new Date()
        });
    },
    addComments: function(comment) {
      console.log(this.userID);
      Comments.insert({
        comment:comment,
        dateAdded:new Date()
      });
    }
  });



if (Meteor.isClient) {

  Template.newsView.helpers({
    getComments: function() {
      console.log(Comments.find({},{sort: {dateAdded: -1}}));
        return Comments.find({},{sort: {dateAdded: -1}});
    }


  });

  Template.newsView.events({
    'submit .addCommentsForm':function(e){
          e.preventDefault();
          var userId = Meteor.userID()
          var userId2 = this.userID()
          console.log(userId, userId2)
          var comments = e.target.comments.value;
          console.log(comments)
          Meteor.call('addComments', comments);
    }

  });

  Template.addNews.events({
    'submit .addNewsForm':function(e){

           var title = e.target.title.value;
           var url= e.target.url.value; 

           if(!title || !url){
               return false;
           }

           Meteor.call('addNews',title,url); 
           Router.go('news.all');

           return false;
       }
    });
 
    Template.newsList.helpers({
        news: function () {
            return News.find({},{sort: {dateAdded: -1}});
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
