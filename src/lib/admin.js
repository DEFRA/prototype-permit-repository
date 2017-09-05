const httpRequest = require('request')
const Helpers = require('./helpers')
const View = require('./view')
const Session = require('./session')
const API = require('./API')
const Tactical = require('./tactical')


console.log('ADMIN JS')

console.log(API)


function upload(request,reply){
fs=require('fs');

  console.log('upload called')

             console.log('path : ' + request.payload.path);
             //   request.payload["fileUpload"].pipe(fs.createWriteStream("test"));
             console.log(__dirname +'/upload.csv');
             fs.rename(request.payload.path, __dirname +'/../assets/upload.csv', function (err) {
                     if (err) {
                             reply({err:err});
                     } else {
                       reply({result:'yay'});
                     }

                 });




};

function index (request, reply) {
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  console.log('*** adminIndex ***')
  reply.view('water/admin/index', viewContext)
}

function fields (request, reply) {
  var viewContext = {}
  var uri = request.connection.info.protocol + '://' + request.info.host + '/API/1.0/field'
  console.log(uri)
  API.system.getFields({}, (data) => {
    var viewContext = View.contextDefaults(request)
    viewContext.pageTitle = 'GOV.UK - Admin/Fields'
    viewContext.data = data
    viewContext.debug.data = viewContext.data
    console.log('*** adminIndex ***')
    reply.view('water/admin/fields', viewContext)
  })
}

function organisations (request, reply) {
  API.org.list(request, (data) => {
    var viewContext = View.contextDefaults(request)
    viewContext.pageTitle = 'GOV.UK - Admin/Fields'
    viewContext.data = data
    reply.view('water/admin/organisations', viewContext)
  })
}
function organisationLicenceTypes (request, reply) {
  var viewContext = {}
  API.licencetype.list(request, (data) => {
    var viewContext = View.contextDefaults(request)
    viewContext.pageTitle = 'GOV.UK - Admin/Fields'
    viewContext.data = data.data
    viewContext.org_id = request.params.org_id
    viewContext.debug.data = viewContext.data.data
    reply.view('water/admin/organisationLicenceTypes', viewContext)
  })
}

function organisationLicenceType (request, reply) {
  var viewContext = {}
  API.licencetype.get(request, (data) => {
    var viewContext = View.contextDefaults(request)
    viewContext.pageTitle = 'GOV.UK - Admin/Fields'
    console.log(JSON.stringify(data.data))
    if (!data.data[0].attributedata) {
      data.data[0].attributedata = []
    }

    viewContext.debug.data = data.data
    viewContext.data = data.data
    viewContext.org_id = request.params.org_id
    viewContext.type_id = request.params.type_id
//    viewContext.debug.data = data

    API.system.getFields({}, (fields) => {
      viewContext.fields = fields.data
      viewContext.debug.fields = fields
//      reply(JSON.stringify(viewContext))
      reply.view('water/admin/organisationLicenceType', viewContext)
    })
  })
}

function addFieldToOrganisationLicenceType (request, reply) {
  console.log(request.params)
  console.log(request.payload)
  API.licencetype.createField(request, (data) => {
    reply('<script>location.href=\'/admin/organisation/' + request.params.org_id + '/licencetypes/' + request.params.type_id + '/\'</script>')
  })
}

function findlicenceform(request,reply){
  var viewContext = View.contextDefaults(request)
  viewContext.pageTitle = 'GOV.UK - Admin'
  reply.view('water/admin/search', viewContext)
}

function doFindlicence(request,reply){
  API.licence.search(request.params.search,(d)=>{
      reply(d)
  })
}

function viewLicence(request,reply){
  var viewContext = View.contextDefaults(request)
  viewContext.licence_id=request.params.licence_id
  API.licence.short
codes(request.params.licence_id,(shortcodes)=>{
    viewContext.shortCodes=shortcodes
      API.licence.users(request.params.licence_id,(users)=>{
            viewContext.users=users
            viewContext.debug={shortCodes:shortcodes,users:users}
            reply.view('water/admin/viewlicence', viewContext)
          })
  })


}

function addShortcode(request,reply){
    API.licence.addshortcode(request.params.licence_id,(res)=>{
      reply.redirect('/admin/licence/'+request.params.licence_id)
    });

}

function users(request,reply){
  reply({toDO:''})
}

function user(request,reply){
  var viewContext = View.contextDefaults(request)
  viewContext.user_id=request.params.user_id
  Tactical.getUserLicences({user_id:request.params.user_id},(licences)=>{
    console.log(licences)
    viewContext.licences=licences
            reply.view('water/admin/viewuser', viewContext)

  })
}

module.exports = {
  upload: upload,
  index: index,
  fields: fields,
  organisations: organisations,
  organisationLicenceTypes: organisationLicenceTypes,
  organisationLicenceType: organisationLicenceType,
  addFieldToOrganisationLicenceType: addFieldToOrganisationLicenceType,
  findlicence:findlicenceform,
  doFindlicence:doFindlicence,
  viewlicence:viewLicence,
  addShortcode:addShortcode,
  users:users,
  user:user

}
