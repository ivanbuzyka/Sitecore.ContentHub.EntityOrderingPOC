var entityLoadedSubscription = options.mediator.subscribe("entityLoaded", function (entity) {
    updateUI(entity);
    var entitySavedEvent = Utils.format("entitySaved:{id}", { id: entity.systemProperties.id() });
    options._page.mediator.subscribe(entitySavedEvent, updateUI);
});

function updateUI(entity){
  // https://lh-healthcare.stylelabs.io/api/entities/36854/relations/TestModelToAsset  
  var entityId = entity.systemProperties.id();

  var testModelToAssetRelation = "https://lh-healthcare.stylelabs.io/api/entities/" + entityId + "/relations/TestModelToAsset";
  var modelEntity = "https://lh-healthcare.stylelabs.io/api/entities/" + entityId;

  // option 1: to use custom JSON property
  /*var currentRelatedAssetsList = entity.properties.RelatedAssetsOrder();
  var relatedAssetsList = currentRelatedAssetsList.orderedAssetIds;
  console.log(currentRelatedAssetsList);
  relatedAssetsList.forEach(el => $("ul.example").append('<li>' + el + '</li>'));

  $("#testbutton1").click(function() {
    var values = [];
    $('ul.example li').each(function(i,v){
      values.push(Number($(v).text()));
    });

    currentRelatedAssetsList.orderedAssetIds = values;
    var payload;
    $.rest.get(modelEntity).done(function (response) {      
      payload = response;
      console.log(payload);
      payload.properties.RelatedAssetsOrder.orderedAssetIds = values;
      $.rest.put(modelEntity, payload);
      location.reload();
    })
  });*/
  // end option 1

  // option 2: to reorder relation children itself
  var currentRelatedAssetsList;

  $.getJSON(testModelToAssetRelation, thisTaxonomyName = function(data) {
    currentRelatedAssetsList = data;
    relatedAssetsList = data.children;        
    relatedAssetsList.forEach(el => $("ul.example").append('<li>' + el.href + '</li>'));
  });

  $("#testbutton1").click(function() {
    var values = [];
    $('ul.example li').each(function(i,v){
      var val = {"href": $(v).text()};      
      values.push(val);
    });

    currentRelatedAssetsList.children = values;

    console.log(currentRelatedAssetsList);
    $.rest.put(testModelToAssetRelation, currentRelatedAssetsList);
    location.reload();
  });
  // end option 2

  $(function () {
    $("ul.example").sortable();
  });
}

