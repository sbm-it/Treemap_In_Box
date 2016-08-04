console.log('BoxApp.js loaded');

BoxApp = function (x) {
    // being used to ini UI
    if ((!x) && (document.getElementById("boxDiv"))) {
        BoxApp.UI()
    } else if (x) { //creating an BoxApp grid instance
        return new BoxApp.grid(x)
    } else {
        console.log('no BoxApp UI')
    }
};

BoxApp.UI = function () {
    console.log('assembling UI ...');
    var div = document.getElementById("boxDiv");
    BoxApp.div = div;
    $('<h4>Loading data from Box.com，Local Drive and Dropbox</h4>').appendTo(div);
    //box
    $('<div id="box-select" data-link-type="direct"  data-client-id="einxjwtgxkwjqaf7pa7xsqyux7znoym2"></div>').appendTo(div);
    $('<div id="loadingBox" style="color:red"> loading Box.com ... </div>').appendTo(div);
    //localFile
    $('<div><input type="file" id="localFile" value="Local File"></div>').appendTo(div);
    //dropbox
    $('<div id="dropBox-select"></div>').appendTo(div);
    $('<div id="loadingDropbox" style="color:red"> loading DropBox.com ... </div>').appendTo(div);



    // load file
      localFile.onchange = function () {
          var f = this.files[0];
          var reader = new FileReader();
          reader.onload = function (x) {
              BoxApp.loadFile(x.target.result, f.name)
          };
          reader.readAsText(f)
      };

      // load DropBox

          var s = document.createElement('script');
          s.src = "https://www.dropbox.com/static/api/2/dropins.js";
          s.id = "dropboxjs";
          s.type = "text/javascript";
          s.setAttribute("data-app-key", "4wdr30ewnj2ut7q");
          s.onload = function () {
              console.log('loaded dropbox file picker');
              var button = Dropbox.createChooseButton(options);
              document.getElementById("dropBox-select").appendChild(button);
              $('#loadingDropbox').remove()
          };
          document.body.appendChild(s);

          options = {
              success: function (files) {
                  //console.log("Files", files)
                  var url = files[0].link;
                  BoxApp.loadDropbox(url)
              },
              cancel: function () {
              },
              linkType: "direct",
              multiselect: false
              //extensions: ['.json', '.txt', '.csv'],
          };

    // load Box.com
    $.getScript("https://app.box.com/js/static/select.js").then(function () {
        $(document).ready(function () {
            var boxSelect = new BoxSelect();
            $('#loadingBox').remove();
            // Register a success callback handler
            boxSelect.success(function (response) {
                console.log(response);
                BoxApp.loadBox(response)
            });
            // Register a cancel callback handler
            boxSelect.cancel(function () {
                console.log("The user clicked cancel or closed the popup");
            });
        });
    });

};

BoxApp.loadBox = function (x) {
    console.log('loading data from Box.com ...');
    var url = x[0].url;

treemap(url)

        };
BoxApp.loadDropbox = function (x) {
        console.log('loading data from Dropbox.com ...');
        var url = x[0].url;

    treemap(url)

            };
      BoxApp.loadFile = function (x) {
        console.log('loading data from local File...');
        var url = x[0].url;

    treemap(url)

            };

BoxApp.fun = function (x, url) {
    BoxApp.log(x.length + ' entries sampled from ' + url, 'blue');
    BoxApp.cleanUI();
    // make sure only numeric parameters go forward
    var alwaysNum = {};
    Object.getOwnPropertyNames(x[0]).forEach(function (p) {
        if (typeof(parseFloat(x[0][p]) == 'number')) {
            alwaysNum[p] = true
        }
    });
    var pp = Object.getOwnPropertyNames(alwaysNum);
    pp.forEach(function (p) {
        x.forEach(function (xi, i) {
            if (alwaysNum[p]) {
                alwaysNum[p] = (!isNaN(parseFloat(xi[p])))
            }
        })
    });
    // remove non-numeric parameters
    var ppn = [], ppnan = [];
    pp.forEach(function (p) {
        if (alwaysNum[p]) {
            ppn.push(p)
        }
        else {
            ppnan.push(p)
        }
    });
    var y = [], z = [];
    x.forEach(function (xi, i) {
        y[i] = {};
        z[i] = {};
        ppn.forEach(function (p) {
            y[i][p] = parseFloat(xi[p])
        });
        ppnan.forEach(function (p) {
            z[i][p] = xi[p]
        })
    });
  BoxApp.plot(y, z)
};

// ini
$(document).ready(function () {
  BoxApp()
});
