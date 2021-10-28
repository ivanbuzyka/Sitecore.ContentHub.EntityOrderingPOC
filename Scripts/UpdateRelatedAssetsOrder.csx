using System.Linq;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;

var entity = Context.Target as IEntity;
MClient.Logger.Info(entity.Id.Value.ToString());
var propertiesLoadOption = new PropertyLoadOption("RelatedAssetsOrder");
var relationsLoadOption = new RelationLoadOption("TestModelToAsset");
await entity.LoadMembersAsync(propertiesLoadOption, relationsLoadOption);

MClient.Logger.Info(entity.Relations.Count().ToString());
IParentToManyChildrenRelation relation = await entity.GetRelationAsync<IParentToManyChildrenRelation>("TestModelToAsset");
if(relation == null)
{
    MClient.Logger.Info("Relation is null");
}

IList<long> relatedAssetIds = relation.Children;
dynamic relatedAssetsOrderJson = entity.GetPropertyValue<JObject>("RelatedAssetsOrder");

//this is the case if the ordered field is completely empty, e.g. when creating new entity
if(relatedAssetsOrderJson == null)
{
    MClient.Logger.Info("relatedAssetsOrderJson is null, initializing new one...");
    relatedAssetsOrderJson = new JObject();
    relatedAssetsOrderJson.Add("orderedAssetIds", new JArray());
}

MClient.Logger.Info(relatedAssetsOrderJson.ToString());

var orderedListToCheck = relatedAssetsOrderJson.orderedAssetIds.ToObject<List<long>>();
var listToUpdate = relatedAssetsOrderJson.orderedAssetIds.ToObject<List<long>>();

// check for elements to remove
foreach (var element in orderedListToCheck)
{
    if (!relatedAssetIds.Contains(element))
    {
        listToUpdate.Remove(element);
    }
}

// add new elements if exist
foreach(var assetId in relatedAssetIds)
{
    if(!listToUpdate.Contains(assetId))
    {
        listToUpdate.Add(assetId);
    }
}

JArray array = new JArray(listToUpdate.ToArray());
JObject updatedJObject = new JObject(new JProperty("orderedAssetIds", array));

MClient.Logger.Info(updatedJObject.ToString());

entity.SetPropertyValue("RelatedAssetsOrder", updatedJObject);
await MClient.Entities.SaveAsync(entity);