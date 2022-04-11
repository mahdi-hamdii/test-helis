<template>
  <div class="hello container">
  <form>
    <label for="category">Review Type</label>
    <select class="form-select" name="reviewType" id="reviewType" v-model="selected" @change="onReviewTypeChange">
    <option v-for="(form,index) in forms" :value="form  " :key="index" >{{form.title}}</option>
    </select>
    <template v-if="selected != null"> 
    <div  v-for="(formData,findex) in formsData" :key="findex">
        <dynamic-form :form="formData" v-if="selected.id == formData.id" :onChange="checkIfValid"  @submitted="handleSubmit" />
        <br>
        <button class="btn btn-primary" submit="true" :form="formData.id" v-if="selected.id == formData.id" :disabled="statusForm">Submit</button>
    </div>
    </template>
    <template>
    </template>
  </form>
  </div>
</template>

<script>
import { TextField, SelectField, TextAreaField, Validator, required } from '@asigloo/vue-dynamic-forms'

export default {
  name: 'AddReview',
    data() {
    return {
      forms: [],
      selected: null,
      formsData:[],
      statusForm:true
          };
  },
  created() {
    this.getForms();
  },
  methods:{
    getForms: function(){
      fetch("/data.json")
      .then(r => r.json())
      .then(json => {
        this.forms= json["review-types"];
        this.forms.forEach(formtype => {
        this.formsData.push(this.createForm(formtype))
        })
        },
      response => {
      console.log('Error loading json:', response)
      });
      this.selected = this.forms[0]
    },
    createForm: function(reviewForm){
      let formJson= {};
      formJson.id = reviewForm.id;
      formJson.fields = {}
      reviewForm.fields.forEach(field => {
        if(field.type == "text"){
          let fieldJson={
            label: field.title
          }
          if(field.required == true){
            fieldJson.validations= [
              Validator({
                validator: required,
                text: 'This field is required',
              })]
          }
          formJson.fields[field.id]=TextField(fieldJson)
        }else if (field.type == "select"){
          let selectoptions = this.getSelectOption(field.options)
          let fieldJson={
            label: field.title,
            options: selectoptions
          }
          if(field.required == true){
            fieldJson.validations= [
              Validator({
                validator: required,
                text: 'This field is required',
              })]
          }
          formJson.fields[field.id]=SelectField(fieldJson)
        }else if(field.type == "textarea"){
          let fieldJson={
            label: field.title
          }
            if(field.required == true){
            fieldJson.validations= [
              Validator({
                validator: required,
                text: 'This field is required',
              })]
          }
          formJson.fields[field.id]=TextAreaField(fieldJson)
        }
      });
      return formJson;
    },
    getSelectOption(selectoptions){
      let options= [];
      selectoptions.forEach(option => {
            options.push({label: option, value: option})
          })
      return options
    },
    checkIfValid(value){
      let valid = false;
      this.selected.fields.forEach(field => {
        if(field.required == true){
          if(value[field.id] == undefined){
            valid= true
          }
        }
      })
      this.statusForm = valid;
    },
    onReviewTypeChange(){
      this.statusForm=true;
      let valid = false;
        this.selected.fields.forEach(field => {
        if(field.required == true){
          valid = true
        }
      })
      this.statusForm= valid;
    },
    handleSubmit(value){
      console.log("Submitted Data", value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
