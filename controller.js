NaT.controller('MainController', ['$scope', 'Firebase', function($scope, Firebase){        

  $scope.collection = [];
  $scope.total = 0;
  $scope.allTags = [];
  $scope.show_tags = false;

  $scope.amount = ''
  $scope.tags = ''

  $scope.tagsPrice;

  $scope.showTags = function(value){
    $scope.show_tags = value;
  }

  $scope.addValue = function(){
    var amount = $scope.amount*1
    if(!amount || amount != $scope.amount) return false;

    var obj = {
      tags: $scope.tags.split(' '),
      value: amount
    };

    Firebase.push( obj )
    addToCollection( obj );
    $scope.amount = ''
    $scope.tags = ''
    document.getElementById('number').focus()
  }

  $scope.addTag = function(tag){
    if( $scope.tags != '' ) {
      tag = ' '+tag
    }
    $scope.tags += tag
  }

  Firebase.once('value', function(snapshot) {
    snapshot.forEach(function(a){
      // console.log('foreach')
      addToCollection( a.val() );
    })
    $scope.$digest()  
  })
  
  // Firebase.on('child_added', function(snapshot) {
  //   console.log('child')
  //   addToCollection( snapshot.val() );
  //   $scope.$digest()
  // });

  function addToCollection(value){
    $scope.collection.push(value)
    $scope.total += value.value*1
    addTags(value.tags)

    var tagsPriceMap = {};
    _.each($scope.collection, function(item){
      _.each(item.tags, function(tag){
        if( tag in tagsPriceMap ) {
          tagsPriceMap[ tag ] += item.value*1;
        } else {
          tagsPriceMap[ tag ] = item.value*1;
        }
      })
    });

    // var tagsPriceCollection = [];
    // _.each( _.keys(tagsPriceMap), function(key){
    //   tagsPriceCollection.push({
    //     tag:key,
    //     value:tagsPriceMap[key]
    //   })
    // });

    // $scope.tagsPrice = tagsPriceCollection;
  }

  function addTags(tags){
    tags.forEach(function(value){
      if( $scope.allTags.indexOf(value) == -1 ) {
        $scope.allTags.push(value)
      }
    })
    $scope.allTags = _.sortBy($scope.allTags, function(item){return item;})
  }

  
}]);
