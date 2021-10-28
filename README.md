# Sitecore.ContentHub.EntityOrderingPOC

In this repository I have a proof-of-concept for the idea to store the order of the entities in the relation.

Example of the JSON Property contents (Property name hardcoded in the code here is `RelatedAssetsOrder`)

```json
{
  "orderedAssetIds": [35119, 33651, 34432]
}
```

The short idea description:
The order will be stored in the JSON property on the parent entity of the relation. For example if we have Test.Model entity which has Related Assets (and we would like to sort those related assets) we need to have a JSON field on Test.Model entity.

Once the related assets relation is changed (edited on existing Tes.Model entity or during creation of the new Test.Model entity) the appropriate JSON property value is updated.

External component shows very trivial example of JS UI for changing an order. That component updates the JSON property value.

In the comments of the external component you may see another idea reflection - to update the relation field children directly to reflect the order. However, I am not sure whether this is a good way to go, since I don't know whether it can be guaranteed that the children within the relation is not re-ordered (since Content Hub is not supposed to keep the order of relations).
