function sampleValue(type) {
  switch (type) {
  case 'array':
    return '[]';
  case 'boolean':
    return 'false';
  case 'date':
    return 'new Date()';
  case 'number':
    return '42';
  case 'object':
    return '{}';
  case 'string':
  default:
    return "'MyString'";
  }
}

function sampleData(attrs) {
  var sampleData = [];
  sampleData.push(' id: 1');

  for(var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    sampleData.push(attr.name + ': ' + attr.sampleValue);
  }

  return '{' + sampleData.join(', ') + ' }';
}

module.exports.sampleData = sampleData;

function attrs(entityOptions) {
  var attrs = [];

  for(var name in entityOptions) {
    var type = entityOptions[name] || '';
    var dasherizedType = stringUtils.dasherize(type);
    var attrName = stringUtils.camelize(name);
    var label = inflection.humanize(name);
    attrs.push({ name: attrName, label: label, sampleValue: sampleValue(dasherizedType) });
  }

  return attrs;
}

module.exports.atrs = attrs;
