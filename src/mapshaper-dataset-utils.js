/* @require mapshaper-common */

MapShaper.validateLayer = function(lyr, arcs) {
  var type = lyr.geometry_type;
  if (!Utils.isArray(lyr.shapes)) {
    error("Layer is missing shapes property");
  }
  if (lyr.data && lyr.data.size() != lyr.shapes.length) {
    error("Layer contains mismatched data table and shapes");
  }
  if (arcs && arcs instanceof ArcDataset === false) {
    error("Expected an ArcDataset");
  }
  if (type == 'polygon' || type == 'polyline') {
    if (!arcs) error("Missing ArcDataset for a", type, "layer");
    // TODO: validate shapes, make sure ids are w/in arc range
  } else if (type == 'point') {
    // TODO: validate shapes
  } else if (type === null) {
    // TODO: make sure shapes are all null
  }
};

// Simple integrity checks
MapShaper.validateDataset = function(data) {
  if (!data) invalid("Missing dataset object");
  if (!Utils.isArray(data.layers) || data.layers.length > 0 === false)
    invalid("Missing layers");
  data.layers.forEach(function(lyr) {
    try {
      MapShaper.validateLayer(lyr, data.arcs);
    } catch (e) {
      invalid(e.message);
    }
  });

  function invalid(msg) {
    error("[validateDataset()] " + msg);
  }
};
