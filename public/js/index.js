
//login
$(function() {
  $("#login3").click(function(event) {
    event.preventDefault();
    alert("oilogin")

    // Gets the form data
    let email = $("input#emaillogin").val();
    let password = $("input#senhalogin").val();

    let newUser = {
      password,
      email
    };

    $.ajax({
      type: "POST",
      url: "/signIn",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(newUser),
      success: function(result) {
        if (result.status === 1) {
          location.href = "/buscar";
        } else {
          document.getElementById("error-login").innerHTML = result.msg;
        }
      }
    });
  });
});


//cadastro
$(function() {
  $("#login2").click(function(event) {
    event.preventDefault();

    // Gets the form data
    let userName = document.forms["Cadastro"]["nomelogin"].value;
    let password = document.forms["Cadastro"]["senhalogin"].value;
    let email = document.forms["Cadastro"]["emaillogin"].value;


    let newUser = {
      userName,
      password,
      email
    };

    $.ajax({
      type: "POST",
      url: "/createUser",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(newUser),
      success: function(result) {
        document.getElementById("error-register").innerHTML = result.msg;
      }
    });
  });
});

//busca
$(function() {

    $("btSearch").click(function(event) {
      event.preventDefault();
  let wrapper = document.getElementById("inputSearch");

  $.ajax({
    type: "GET",
    url: "/buscar",
    data: {
      searchTerm: searchTerm
    },
    success: function(result) {
      console.log(result);
      let content = ``;
      for (let i = 0; i < result.length; i++) {
        content += `<div class="telatoda">
            <div class="other-images">
              <div>
                <img src="upload/${result[i].conteudo}">
              </div>
            </div>
            <div class="texto">
              <p>${result[i].titulo}</p>
            </div>
          </div>`;
      }
      wrapper.innerHTML = content;
    }
  });
})
});