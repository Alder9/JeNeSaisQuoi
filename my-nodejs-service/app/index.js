let cur_index = 1;
const off_white_color = "#f9f9f9";
const yeezy_color = "black";

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];

const month_year = {
  1: "9-2017",
  2: "10-2017",
  3: "11-2017",
  4: "12-2017",
  5: "1-2018",
  6: "2-2018",
  7: "3-2018",
  8: "4-2018",
  9: "5-2018",
  10: "6-2018",
  11: "7-2018",
  12: "8-2018",
  13: "9-2018",
  14: "10-2018",
  15: "11-2018",
  16: "12-2018",
  17: "1-2019",
  18: "2-2019"
};

classified_data = {};

function add_information(i) {
  let top_container = document.getElementById("top-container");
  top_container.style.justifyContent = "space-evenly";

  let state_info = document.getElementById("state-information");
  state_info.style.width = "30vw";

  let data_info = document.createElement("div");
  data_info.id = "data-info";
  state_info.append(data_info);

  // Adding the State name title
  let title = document.createElement("div");
  title.id = "title";
  let title_header = document.createElement("h1");
  title_header.innerText = `${states[i]} (${month_year[cur_index]})`;

  title.appendChild(title_header);
  data_info.appendChild(title);

  // Adding the Best Selling Sneakers
  const best_selling_sneaker =
    classified_data[`${month_year[cur_index]}-${states[i]}`][
      "most_popular_sneaker"
    ];
  let best_seller = document.createElement("div");
  best_seller.id = "best-seller";
  let best_seller_title = document.createElement("h2");
  best_seller_title.innerText = "Best Selling Sneakers: ";
  let best_seller_text = document.createElement("span");
  best_seller_text.innerText = `${best_selling_sneaker["name"]}`;
  let img_container = document.createElement("div");
  img_container.className = "shoe-image";
  let best_seller_img = document.createElement("img");

  best_seller.appendChild(best_seller_title);
  best_seller.appendChild(best_seller_text);
  best_seller.appendChild(img_container);
  data_info.appendChild(best_seller);

  fetch(
    `http://localhost:8080/search-image?name=${best_selling_sneaker["name"]}`
  )
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log(res);
      best_seller_img.src = res["value"][0]["url"];

      img_container.appendChild(best_seller_img);
    });
  // Adding the retail price and the average price
  let state_pricing = document.createElement("div");
  state_pricing.id = "state-pricing";
  let retail = document.createElement("div");
  retail.className = "price";
  retail.innerText = `Average Retail: $${best_selling_sneaker[
    "average_retail"
  ].toFixed(2)}`;
  let sale = document.createElement("div");
  sale.className = "price";
  sale.innerText = `stockX Average Sale Price: $${best_selling_sneaker[
    "average_sale_price"
  ].toFixed(2)}`;

  state_pricing.appendChild(retail);
  state_pricing.appendChild(sale);
  data_info.append(state_pricing);

  let news_container = document.createElement("div");
  news_container.id = "news-container";
  let news_container_title = document.createElement("h2");
  news_container_title.innerText = "Recent News: ";
  state_info.append(news_container_title);

  state_info.append(news_container);

  fetch(
    `http://localhost:8080/search-news?name=${best_selling_sneaker["name"]}`
  )
    .then(res => {
      return res.json();
    })
    .then(res => {
      res["value"].forEach(ele => {
        let article_container = document.createElement("div");
        article_container.className = "article-container";
        article_container.onclick = e => {
          window.open(ele["url"], "_blank");
        };

        let news_title = document.createElement("h2");
        news_title.innerText = ele["name"];

        let news_date = document.createElement("h4");
        news_date.innerText = ele["datePublished"].slice(
          0,
          ele["datePublished"].indexOf("T")
        );

        let news_short_description = document.createElement("h3");
        news_short_description.innerText =
          ele["description"].slice(
            0,
            ele["description"].length >= 50 ? 50 : ele["description"].length
          ) + "...";

        article_container.append(news_title);
        article_container.append(news_date);
        article_container.append(news_short_description);

        news_container.append(article_container);
      });
      // best_seller_img.src = res["value"][0]["url"];

      // img_container.appendChild(best_seller_img);
    });
}

function clear_information() {
  let top_container = document.getElementById("top-container");
  top_container.style.justifyContent = "center";

  let state_info = document.getElementById("state-information");
  state_info.innerHTML = "";
  state_info.style.width = "0px";
}

function classify_data(_callback) {
  // Get data from Google Cloud

  // Iterate through data
  let cur_yeezy_count = {};
  let cur_white_count = {};
  let cur_sneakers = {};
  let prev_month = 9;
  let prev_year = 2017;

  states.forEach(ele => {
    cur_yeezy_count[ele] = 0;
    cur_white_count[ele] = 0;
    cur_sneakers[ele] = {};
  });

  // for (let order of test) {
  let url = "http://localhost:8080/json-all";
  fetch(url)
    .then(res => {
      if (res == undefined) {
        return {};
      }
      if (res.status == 200) {
        return res.json();
      } else {
        console.log("pooh", res.code);
        return {};
      }
    })
    .then(orders => {
      //console.log(orders);
      orders.forEach(function(order) {
        while (order["Sneaker Name"].indexOf("-") != -1) {
          order["Sneaker Name"] = order["Sneaker Name"].replace("-", " ");
        }
        var date = order["Order Date"];
        var tmp = date.split("/");
        let cur_month = parseInt(tmp[0]);
        let cur_year = parseInt(tmp[2]);
        let cur_state = order["Buyer Region"];
        if (cur_month !== prev_month || cur_year !== prev_year) {
          states.forEach(state => {
            let brand = "";
            if (cur_yeezy_count[state] === cur_white_count[state]) {
              brand = "neutral";
            } else if (cur_yeezy_count[state] > cur_white_count[state]) {
              brand = "yeezy";
            } else {
              brand = "off white";
            }

            let sneaker = {};
            let max = 0;
            for (let key in cur_sneakers[state]) {
              if (cur_sneakers[state][key]["count"] > max) {
                max = cur_sneakers[state][key];
                sneaker = {
                  name: key,
                  average_retail:
                    cur_sneakers[state][key]["retail_total"] /
                    cur_sneakers[state][key]["count"],
                  average_sale_price:
                    cur_sneakers[state][key]["sale_total"] /
                    cur_sneakers[state][key]["count"]
                };
              }
            }
            classified_data[`${prev_month}-${prev_year}-${state}`] = {
              yeezy_count: cur_yeezy_count[state],
              white_count: cur_white_count[state],
              brand: brand,
              most_popular_sneaker:
                brand !== "neutral"
                  ? sneaker
                  : { name: "", average_retail: 0.0, average_sale_price: 0.0 }
            };
            classified_data[`${prev_month}-${prev_year}-${state}`];
          });

          prev_month = cur_month;
          prev_year = cur_year;
          states.forEach(ele => {
            cur_yeezy_count[ele] = 0;
            cur_white_count[ele] = 0;
            cur_sneakers[ele] = {};
          });
        }
        // Month, year, state exists
        else {
          // Check the brand and increment
          let cur_state = order["Buyer Region"];
          if (order["Brand"] == "Yeezy") {
            cur_yeezy_count[cur_state]++;
          } else {
            cur_white_count[cur_state]++;
          }

          // Check the sneaker name
          if (order["Sneaker Name"] in cur_sneakers[cur_state]) {
            cur_sneakers[cur_state][order["Sneaker Name"]]["count"]++;
            cur_sneakers[cur_state][order["Sneaker Name"]][
              "retail_total"
            ] += parseInt(
              order["Retail Price"].slice(1, order["Retail Price"].length)
            );
            cur_sneakers[cur_state][order["Sneaker Name"]][
              "sale_total"
            ] += parseInt(
              order["Sale Price"].slice(1, order["Sale Price"].length)
            );
          } else {
            cur_sneakers[cur_state][order["Sneaker Name"]] = {};
            cur_sneakers[cur_state][order["Sneaker Name"]]["count"] = 1;
            cur_sneakers[cur_state][order["Sneaker Name"]][
              "retail_total"
            ] = parseInt(
              order["Retail Price"].slice(1, order["Retail Price"].length)
            );
            cur_sneakers[cur_state][order["Sneaker Name"]][
              "sale_total"
            ] = parseInt(
              order["Sale Price"].slice(1, order["Sale Price"].length)
            );
          }
        }

        states.forEach(state => {
          let brand = "";
          if (cur_yeezy_count[state] === cur_white_count[state]) {
            brand = "neutral";
          } else if (cur_yeezy_count[state] > cur_white_count[state]) {
            brand = "yeezy";
          } else {
            brand = "off white";
          }

          let sneaker = {};
          let max = 0;
          for (let key in cur_sneakers[state]) {
            if (cur_sneakers[state][key]["count"] > max) {
              max = cur_sneakers[state][key];
              sneaker = {
                name: key,
                average_retail:
                  cur_sneakers[state][key]["retail_total"] /
                  cur_sneakers[state][key]["count"],
                average_sale_price:
                  cur_sneakers[state][key]["sale_total"] /
                  cur_sneakers[state][key]["count"]
              };
            }
          }
          classified_data[`${prev_month}-${prev_year}-${state}`] = {
            yeezy_count: cur_yeezy_count[state],
            white_count: cur_white_count[state],
            brand: brand,
            most_popular_sneaker:
              brand !== "neutral"
                ? sneaker
                : { name: "", average_retail: 0.0, average_sale_price: 0.0 }
          };
        });
      });
      console.log("done with classify_data");
      _callback();
    });
}

function update_map(date) {
  let i = 0;
  d3.selectAll("#states path").attr("fill", () => {
    if (i >= states.length) {
      return "grey";
    }

    let key = `${date}-${states[i]}`;
    let color = "grey";

    if (!(key in classified_data)) {
      return "grey";
    }

    if (classified_data[key]["brand"] === "yeezy") {
      color = yeezy_color;
    } else if (classified_data[key]["brand"] === "off white") {
      color = off_white_color;
    }

    i++;
    return color;
  });
}

function main() {
  // console.log(test);
  classify_data();
  console.log(classified_data);
  var width = 960,
    height = 500,
    centered;

  var projection = d3.geo
    .albersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path().projection(projection);

  var svg = d3
    .select("#map-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

  var g = svg.append("g");

  d3.json("/us.json", function(error, us) {
    if (error) throw error;
    console.log(us);
    us["objects"]["states"]["geometries"] = us["objects"]["states"][
      "geometries"
    ].map((ele, i) => {
      ele["id"] = i;
      return ele;
    });
    g.append("g")
      .attr("id", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", () => {
        update_map(month_year[1]);
      })
      .on("click", clicked);

    g.append("path")
      .datum(
        topojson.mesh(us, us.objects.states, function(a, b) {
          return a !== b;
        })
      )
      .attr("id", "state-borders")
      .attr("d", path);
  });
  var legendRectSize = 18;
  var legendSpacing = 4;
  var legend = d3.select("#legend").append("svg");
  legend
    .append("rect")
    .attr("x", 5)
    .attr("y", legendRectSize)
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", yeezy_color)
    .style("stroke", yeezy_color);
  legend
    .append("text")
    .attr("x", legendRectSize + legendSpacing + 5)
    .attr("y", legendRectSize + 15)
    .text("Adidas Yeezy");

  legend
    .append("rect")
    .attr("x", 5)
    .attr("y", 2 * legendRectSize + 10)
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", off_white_color)
    .style("stroke", off_white_color);
  legend
    .append("text")
    .attr("x", legendRectSize + legendSpacing + 5)
    .attr("y", 2 * legendRectSize + 25)
    .text("Nike Off White");

  legend
    .append("rect")
    .attr("x", 5)
    .attr("y", 3 * legendRectSize + 20)
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", "grey")
    .style("stroke", "grey");
  legend
    .append("text")
    .attr("x", legendRectSize + legendSpacing + 5)
    .attr("y", 3 * legendRectSize + 35)
    .text("Neutral");
  // legend
  //   .append("text")
  //   .attr("x", legendRectSize + legendSpacing)
  //   .attr("y", legendRectSize - legendSpacing)
  //   .text(function(d) {
  //     switch (d) {
  //       case off_white_color:
  //         return "Nike Off White";
  //       case yeezy_color:
  //         return "Adidas Yeezy";
  //       default:
  //         return "Neutral";
  //     }
  //   });

  function clicked(d) {
    var x, y, k;

    if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    g.selectAll("path").classed(
      "active",
      centered &&
        function(d) {
          return d === centered;
        }
    );

    g.transition()
      .duration(750)
      .attr(
        "transform",
        "translate(" +
          width / 2 +
          "," +
          height / 2 +
          ")scale(" +
          k +
          ")translate(" +
          -x +
          "," +
          -y +
          ")"
      )
      .style("stroke-width", 1.5 / k + "px");

    // We are not zoomed in when centered is not true
    if (centered) {
      clear_information();
      add_information(d["id"]);
    } else {
      clear_information();
    }
    // var radius = Math.min(width, height) / 2;

    // var color = d3.scale.category20();

    // var pie = d3.layout
    //   .pie()
    //   .value(function(d1) {
    //     return 10;
    //   })
    //   .sort(null);

    // var arc = d3.svg
    //   .arc()
    //   .innerRadius(radius - 100)
    //   .outerRadius(radius - 20);

    // var paths = d3.selectAll("path")[0];
    // console.log(classified_data[`${month_year[cur_index]}-${states[d["id"]]}`]);
    // var test = svg
    //   .datum(classified_data[`${month_year[cur_index]}-${states[d["id"]]}`])
    //   .selectAll("path")
    //   .data(pie)
    //   .enter()
    //   .append("path")
    //   .attr("fill", function(d1, i) {
    //     return "yellow";
    //   })
    //   .attr("d", arc);
  }

  var slider = document.getElementById("mapRange");
  var output = document.getElementById("date");
  output.innerHTML = month_year[cur_index];
  slider.oninput = function() {
    // Color code: off-white - #f9f9f9, adidas - black
    // Start date: Aug. 2017 = 1
    // End date: Feb 2019 = 18
    cur_index = this.value;
    var date = month_year[cur_index];
    update_map(date);
    output.innerHTML = date;
    clicked(null);
  };
}

/**
 * For Dynamic navbar
 */
function responsiveNavBarFunc() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

const test = [
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,097",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$685",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$690",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,075",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$828",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "Rhode Island"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$798",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$784",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$465",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Kansas"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$465",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$515",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$473",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$525",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$658",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$589",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$850",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$546",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$586",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$850",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 8,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$999",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$740",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$765",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$479",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$572",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$595",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$589",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,068",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,095",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 13,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$820",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$715",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$870",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 12,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$459",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$458",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$481",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$563",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$695",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$595",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$960",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$785",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$799",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$850",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 6.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$436",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$481",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Louisiana"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$605",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$659",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$594",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$530",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$870",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 6,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$708",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,162",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$815",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$799",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$775",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$549",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$520",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$492",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$535",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$655",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Nebraska"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$623",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$583",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$652",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$904",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$675",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$697",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$845",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$815",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$790",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 14,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$456",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$487",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$467",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$667",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$749",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$655",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$645",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$545",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Missouri"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Moonrock",
    "Sale Price": "$1,230",
    "Retail Price": "$200",
    "Release Date": "11/14/2015",
    "Shoe Size": 10.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$746",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 4,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$699",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$775",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$911",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 4,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$830",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$860",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$720",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$491",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 4,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$458",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Rhode Island"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$660",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$579",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$615",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$1,600",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$1,090",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,344",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,325",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/7/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,800",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$920",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$785",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$875",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$740",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$865",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$452",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$469",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$438",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$564",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$670",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$645",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$666",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$645",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "South Carolina"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Maine"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,450",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,325",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$850",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,299",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$2,399",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$720",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$750",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$1,100",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,092",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$829",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$747",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$814",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$446",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$490",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$485",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$608",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$567",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$587",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,799",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,550",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$949",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$1,100",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$850",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,299",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$680",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$999",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 12,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$990",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$695",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$810",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$722",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$500",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$485",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "South Carolina"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$579",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,100",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$965",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$940",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,329",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,270",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,190",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,300",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,200",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$930",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$734",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Oxford-Tan",
    "Sale Price": "$1,101",
    "Retail Price": "$200",
    "Release Date": "12/29/2015",
    "Shoe Size": 8,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,100",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,050",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,200",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 12.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$810",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$861",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$799",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 4,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$447",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$479",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$622",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$628",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$567",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,140",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "South Carolina"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$830",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$820",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,700",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,239",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,150",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,269",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,300",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 6,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,135",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$770",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$735",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$556",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$620",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$1,000",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$985",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$985",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$642",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,049",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$715",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Kansas"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$478",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$515",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$478",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$565",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$675",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$745",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$745",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$567",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$631",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,907",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$840",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$920",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$850",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,200",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,100",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,200",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$645",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/12/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$600",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,139",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 12,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$641",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$810",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$712",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$820",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 6,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$459",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$529",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$606",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$624",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$691",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$619",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$785",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$599",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,100",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,900",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,000",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$890",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,050",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,190",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "Rhode Island"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$990",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,070",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$700",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$670",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$985",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Turtledove",
    "Sale Price": "$2,300",
    "Retail Price": "$200",
    "Release Date": "6/27/2015",
    "Shoe Size": 14,
    "Buyer Region": "Iowa"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$910",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$680",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,002",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$810",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$998",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 6,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$817",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$469",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$431",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$626",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$599",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$608",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$569",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,700",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,110",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,050",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$870",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,210",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$999",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$620",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$625",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/14/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$664",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Turtledove",
    "Sale Price": "$1,890",
    "Retail Price": "$200",
    "Release Date": "6/27/2015",
    "Shoe Size": 12,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$790",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$975",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$875",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$860",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$474",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$567",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$679",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "Missouri"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$603",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$701",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$618",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,100",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,815",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,100",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,999",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$820",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,250",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,110",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,000",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/15/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$675",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$971",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$794",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$748",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$465",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$436",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$476",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$474",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$454",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$594",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$550",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$719",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$634",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,900",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,850",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$900",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,100",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,250",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,000",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/16/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,050",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$970",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,145",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,001",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$998",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$795",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$490",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 7,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Rhode Island"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$594",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,910",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,200",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,200",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Tennessee"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,275",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,080",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,007",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$720",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$925",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 6,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$681",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,000",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$802",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$676",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$463",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$468",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$515",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 4,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "West Virginia"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$624",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$605",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$602",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$599",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$627",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Indiana"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,800",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,725",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$900",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,250",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,065",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Arkansas"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,090",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$955",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$690",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$871",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 8,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$988",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$761",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$801",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 12,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$491",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$465",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$520",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$459",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "South Carolina"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$540",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 14,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$451",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$611",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$633",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,772",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,000",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$948",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,350",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,060",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$929",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$885",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$715",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/19/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$690",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2015",
    "Sale Price": "$1,150",
    "Retail Price": "$200",
    "Release Date": "8/22/2015",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$760",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 8,
    "Buyer Region": "Tennessee"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$799",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$664",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$464",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$510",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$461",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$624",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$565",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$629",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$627",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$688",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,950",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,770",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$760",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$820",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,195",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$940",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$970",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,350",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Alaska"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,050",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$660",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/20/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$725",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Turtledove",
    "Sale Price": "$1,875",
    "Retail Price": "$200",
    "Release Date": "6/27/2015",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,005",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$775",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,009",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$782",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 13,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$755",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$788",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$466",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$605",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$595",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$646",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,850",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,900",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,950",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$800",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,265",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,350",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,050",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "9/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$580",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$765",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$616",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,045",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$771",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$775",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 13,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$639",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$440",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$459",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$530",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 7,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$440",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$611",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$670",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$611",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$628",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,800",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$670",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$810",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,105",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$900",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,108",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$715",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,060",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$820",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$775",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$464",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$469",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$720",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,890",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,886",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$800",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$780",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,150",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Indiana"
  },
  {
    "Order Date": "9/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,149",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,155",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$725",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$784",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$941",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 4,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$820",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$462",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$472",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$535",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$648",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 4,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$629",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$725",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,786",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$945",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/24/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$675",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Oxford-Tan",
    "Sale Price": "$1,299",
    "Retail Price": "$200",
    "Release Date": "12/29/2015",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$1,455",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 6,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Turtledove",
    "Sale Price": "$1,995",
    "Retail Price": "$200",
    "Release Date": "6/27/2015",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$900",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 6.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$747",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 4,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,000",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$785",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$787",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$445",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$515",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$810",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$589",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Kansas"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$730",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$834",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$655",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,980",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$790",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,250",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$699",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Moonrock",
    "Sale Price": "$1,257",
    "Retail Price": "$200",
    "Release Date": "11/14/2015",
    "Shoe Size": 9.5,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$989",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$825",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$823",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$775",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$704",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$796",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 4,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 5,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$490",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$478",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Wyoming"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$479",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$542",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Tennessee"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$605",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$581",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$589",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$613",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$714",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,801",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$777",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,099",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,150",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 7,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$960",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,000",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "9/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$740",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$885",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,000",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$900",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$819",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "Tennessee"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$885",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 6,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$490",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$489",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$678",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$740",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 16,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$639",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Missouri"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$593",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$675",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,750",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,700",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$870",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$785",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,160",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,250",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,098",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$699",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Utah"
  },
  {
    "Order Date": "9/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$596",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$755",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$780",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$425",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 14,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$669",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$615",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$658",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 16,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,885",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$700",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,250",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/28/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,200",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$682",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,045",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$915",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 13,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$462",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$457",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$519",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$458",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$732",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$801",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$611",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,914",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,760",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$750",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$815",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,230",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,399",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$965",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$976",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$835",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$946",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$787",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$795",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$505",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$457",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$670",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,879",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$800",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,050",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "9/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$825",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New Hampshire"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,150",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,025",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$805",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$830",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$500",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$467",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$469",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$595",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$464",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$605",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$642",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$663",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,975",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,175",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/1/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$730",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,130",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 12,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,055",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$833",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$790",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Rhode Island"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$1,025",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$815",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 6,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$771",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$461",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Missouri"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$648",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$639",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$660",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 4,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$649",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,000",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,005",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$820",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/2/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,300",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,155",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$976",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 4,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$766",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$874",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$830",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$790",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$777",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$499",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$465",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$572",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 4,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 16,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$670",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Indiana"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$720",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$569",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Iowa"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$550",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$669",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$675",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,756",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,947",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$850",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Utah"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,060",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,250",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$965",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/3/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$745",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Moonrock",
    "Sale Price": "$1,000",
    "Retail Price": "$200",
    "Release Date": "11/14/2015",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,010",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$964",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,039",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$950",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 6,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$755",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$831",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$690",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 8,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$477",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$485",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$773",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 5.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$530",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$675",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "Maine"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$699",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$655",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Rhode Island"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$660",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,950",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$835",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,350",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$920",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/4/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$785",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2015",
    "Sale Price": "$939",
    "Retail Price": "$200",
    "Release Date": "8/22/2015",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,000",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 12,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$993",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$785",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$785",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11,
    "Buyer Region": "Vermont"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$468",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$500",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$641",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$621",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/5/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$850",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$810",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 8,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,049",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$809",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$775",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$686",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 8,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$513",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$474",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$510",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "West Virginia"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$669",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$660",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$670",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$617",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,820",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,399",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,260",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/6/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$955",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$999",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$795",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$461",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$495",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$525",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$456",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$705",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 4,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$785",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/7/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,200",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2015",
    "Sale Price": "$910",
    "Retail Price": "$200",
    "Release Date": "8/22/2015",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,090",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$950",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$880",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$798",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$471",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$469",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$690",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$641",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$660",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$624",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "South Carolina"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,950",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$850",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,300",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/8/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,195",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$993",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$765",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$477",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$495",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Maine"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$550",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$451",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$595",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$825",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 17,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$702",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,870",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/9/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$950",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2015",
    "Sale Price": "$920",
    "Retail Price": "$200",
    "Release Date": "8/22/2015",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$940",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$1,095",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 5.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$920",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$988",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Indiana"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 13,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$456",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$479",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$644",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$740",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$565",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$670",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$675",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,908",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$850",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,399",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/10/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,047",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$855",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$898",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$770",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$695",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$456",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$451",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$612",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$670",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$747",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 16,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,258",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/11/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$995",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Moonrock",
    "Sale Price": "$1,250",
    "Retail Price": "$200",
    "Release Date": "11/14/2015",
    "Shoe Size": 6.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$970",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$990",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 6.5,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$950",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$866",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$805",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$670",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$661",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/12/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$565",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Moonrock",
    "Sale Price": "$1,250",
    "Retail Price": "$200",
    "Release Date": "11/14/2015",
    "Shoe Size": 6,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Oxford-Tan",
    "Sale Price": "$1,056",
    "Retail Price": "$200",
    "Release Date": "12/29/2015",
    "Shoe Size": 9.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Oxford-Tan",
    "Sale Price": "$1,000",
    "Retail Price": "$200",
    "Release Date": "12/29/2015",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2015",
    "Sale Price": "$950",
    "Retail Price": "$200",
    "Release Date": "8/22/2015",
    "Shoe Size": 9,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2015",
    "Sale Price": "$900",
    "Retail Price": "$200",
    "Release Date": "8/22/2015",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$951",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$936",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Turtledove",
    "Sale Price": "$1,910",
    "Retail Price": "$200",
    "Release Date": "6/27/2015",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Turtledove",
    "Sale Price": "$1,505",
    "Retail Price": "$200",
    "Release Date": "6/27/2015",
    "Shoe Size": 13,
    "Buyer Region": "Missouri"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$890",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 8,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$973",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$991",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$825",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$809",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,000",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$900",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$940",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$965",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,000",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$663",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$711",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 13,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$690",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$621",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$646",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$871",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 13,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$963",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,130",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 6.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,026",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$981",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$851",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$736",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Missouri"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$760",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$740",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$695",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$768",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$740",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$755",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$801",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$687",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$730",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$742",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$735",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$689",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$850",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$720",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 12,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$691",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$680",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$416",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$420",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$415",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$418",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$426",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$436",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$451",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$495",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 13,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$444",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$419",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$545",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "District of Columbia"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$440",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$443",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$413",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$442",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Rhode Island"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$425",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$425",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$431",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Arkansas"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$486",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$425",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$425",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$425",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$618",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$606",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$505",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$541",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$586",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$584",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$598",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$583",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$700",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$622",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$589",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$735",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$628",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$588",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$542",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$530",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$661",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$616",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$591",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$571",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$599",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$530",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Indiana"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$645",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$632",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$629",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$599",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$646",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$597",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$625",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$577",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$556",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$626",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$608",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,700",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,800",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,999",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 7,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,799",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$820",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$849",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,058",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$950",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,010",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/13/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$1,020",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$1,036",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 12,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Turtledove",
    "Sale Price": "$1,501",
    "Retail Price": "$200",
    "Release Date": "6/27/2015",
    "Shoe Size": 13,
    "Buyer Region": "Missouri"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$930",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$970",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$702",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "Maine"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$720",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$703",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 7.5,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$425",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$477",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$430",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$607",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$730",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 16,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 13.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$638",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Tennessee"
  },
  {
    "Order Date": "10/14/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$584",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,051",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 13,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$860",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$446",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$658",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$723",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/15/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$521",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Moonrock",
    "Sale Price": "$1,037",
    "Retail Price": "$200",
    "Release Date": "11/14/2015",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$730",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$695",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "South Carolina"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$426",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Wisconsin"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$591",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/16/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,310",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$1,149",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 4,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$1,100",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$898",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 6,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$714",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$525",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$485",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$565",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Hawaii"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$790",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "10/17/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$790",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$905",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 13,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$799",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$899",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 6,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$425",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$484",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$465",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$550",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$550",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Iowa"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$638",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/18/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$875",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,111",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 11,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$838",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 14,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$465",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$628",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$665",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/19/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$626",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Moonrock",
    "Sale Price": "$1,113",
    "Retail Price": "$200",
    "Release Date": "11/14/2015",
    "Shoe Size": 8.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$675",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$830",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$710",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$462",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$488",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$639",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$647",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/20/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,020",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 9.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$780",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$785",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$785",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 7,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$440",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Mexico"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$699",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 6.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Tennessee"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Semi-Frozen-Yellow",
    "Sale Price": "$1,825",
    "Retail Price": "$220",
    "Release Date": "11/18/2017",
    "Shoe Size": 11,
    "Buyer Region": "Indiana"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$575",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$668",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$571",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,850",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/21/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$850",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$835",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 7,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$829",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$469",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,899",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/22/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$1,000",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$685",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$810",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 5.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$825",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$859",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 14,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$475",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$605",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$645",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$645",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$649",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$621",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$770",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 10,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$750",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$805",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "Indiana"
  },
  {
    "Order Date": "10/23/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,414",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$931",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Copper",
    "Sale Price": "$681",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,047",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 4,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$799",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$1,050",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$719",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$705",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$470",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$498",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Tennessee"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$622",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Minnesota"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$631",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "West Virginia"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$746",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 16,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$900",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,100",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$975",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/24/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Blazer-Mid-Off-White",
    "Sale Price": "$800",
    "Retail Price": "$130",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$835",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$692",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$720",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$545",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 4,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$469",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$460",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$635",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$780",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 5.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$631",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,700",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,990",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$650",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$745",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$750",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,425",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 10,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/25/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$931",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Oxford-Tan",
    "Sale Price": "$1,222",
    "Retail Price": "$200",
    "Release Date": "12/29/2015",
    "Shoe Size": 11.5,
    "Buyer Region": "Kentucky"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$616",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 11.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$780",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Maryland"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$805",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$870",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$550",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 4,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "North Carolina"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$455",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Massachusetts"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$640",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 7,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$590",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$570",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$799",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 12,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$625",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 13,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/26/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,325",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$900",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 8,
    "Buyer Region": "Alabama"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$796",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$840",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$750",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$755",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 11,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$615",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 5,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$427",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 8,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$419",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Colorado"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$629",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Ohio"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$655",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 12,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$630",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/27/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$2,100",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$1,037",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 4,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11.5,
    "Buyer Region": "Arizona"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$572",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 7,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "New Hampshire"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$602",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Oregon"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$580",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$585",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$775",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/28/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$1,130",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Delaware"
  },
  {
    "Order Date": "10/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$800",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 7,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$480",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$490",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 7.5,
    "Buyer Region": "Oklahoma"
  },
  {
    "Order Date": "10/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$540",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$787",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 14.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/29/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$579",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/29/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$791",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Moonrock",
    "Sale Price": "$1,050",
    "Retail Price": "$200",
    "Release Date": "11/14/2015",
    "Shoe Size": 7.5,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$1,112",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 5,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Green",
    "Sale Price": "$650",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 10.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$458",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "District of Columbia"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$437",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 9,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$456",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$565",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9,
    "Buyer Region": "New York"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$601",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 11,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$636",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Pennsylvania"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$546",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,660",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "Nevada"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$867",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 14,
    "Buyer Region": "Connecticut"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$800",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 8,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Max-90-Off-White",
    "Sale Price": "$800",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 11,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,300",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "New Jersey"
  },
  {
    "Order Date": "10/30/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$955",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 12,
    "Buyer Region": "Texas"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-Pirate-Black-2016",
    "Sale Price": "$1,129",
    "Retail Price": "$200",
    "Release Date": "2/19/2016",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-Low-V2-Beluga",
    "Sale Price": "$1,050",
    "Retail Price": "$220",
    "Release Date": "9/24/2016",
    "Shoe Size": 13,
    "Buyer Region": "Washington"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red",
    "Sale Price": "$956",
    "Retail Price": "$220",
    "Release Date": "11/23/2016",
    "Shoe Size": 12,
    "Buyer Region": "Virginia"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-Red-2017",
    "Sale Price": "$820",
    "Retail Price": "$220",
    "Release Date": "2/11/2017",
    "Shoe Size": 11,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$719",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Core-Black-White",
    "Sale Price": "$841",
    "Retail Price": "$220",
    "Release Date": "12/17/2016",
    "Shoe Size": 4,
    "Buyer Region": "Louisiana"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$601",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 5.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$600",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 4.5,
    "Buyer Region": "Vermont"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$450",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 10,
    "Buyer Region": "Maine"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Cream-White",
    "Sale Price": "$440",
    "Retail Price": "$220",
    "Release Date": "4/29/2017",
    "Shoe Size": 11,
    "Buyer Region": "Illinois"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$610",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Michigan"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$533",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$565",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "Georgia"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$620",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 10.5,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Yeezy",
    "Sneaker Name": "Adidas-Yeezy-Boost-350-V2-Zebra",
    "Sale Price": "$560",
    "Retail Price": "$220",
    "Release Date": "2/25/2017",
    "Shoe Size": 8.5,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Off-White",
    "Sneaker Name": "Air-Jordan-1-Retro-High-Off-White-Chicago",
    "Sale Price": "$1,650",
    "Retail Price": "$190",
    "Release Date": "9/9/2017",
    "Shoe Size": 13,
    "Buyer Region": "Florida"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Force-1-Low-Off-White",
    "Sale Price": "$750",
    "Retail Price": "$170",
    "Release Date": "11/1/2017",
    "Shoe Size": 12,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-Presto-Off-White",
    "Sale Price": "$1,400",
    "Retail Price": "$160",
    "Release Date": "9/9/2017",
    "Shoe Size": 9,
    "Buyer Region": "California"
  },
  {
    "Order Date": "10/31/2017",
    Brand: "Off-White",
    "Sneaker Name": "Nike-Air-VaporMax-Off-White",
    "Sale Price": "$945",
    "Retail Price": "$250",
    "Release Date": "9/9/2017",
    "Shoe Size": 9.5,
    "Buyer Region": "Illinois"
  }
];

classify_data(() => main());
