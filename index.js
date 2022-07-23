const request = require("request-promise");
const cheerio = require("cheerio");
const movies = [
  "https://www.imdb.com/title/tt0242519/?ref=_tt_sims_tt",
  "https://www.imdb.com/title/tt2283748/?ref_=tt_sims_tt_i_3",
  "https://www.imdb.com/title/tt0374887/?ref_=tt_sims_tt_i_2",
  "https://www.imdb.com/title/tt1187043/?ref_=tt_sims_tt_i_10",
  "https://www.imdb.com/title/tt2631186/?ref_=tt_sims_tt_i_3",
];

(async () => {
  let imdbData = [];

  for (let movie of movies) {
    const response = await request({
      uri: movie,
      headers: {
        accept:
          " text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
      },
      gzip: true,
    });
    let $ = cheerio.load(response);
    const title = $('div[class="sc-94726ce4-2 khmuXj"] > h1').text().trim();
    const rating = $(
      'div[data-testid="hero-rating-bar__aggregate-rating__score"] > span[class="sc-7ab21ed2-1 jGRxWM"]'
    ).text();
    const image = $('a[class="ipc-lockup-overlay ipc-focusable"]').attr("href");
    const summary = $(
      'div[class="sc-16ede01-7 hrgVKw"] > span[class="sc-16ede01-0 fMPjMP"]'
    )
      .text()
      .trim();
    const genre = [];
    $(
      'div[class="ipc-chip-list__scroller"] > a[class="sc-16ede01-3 bYNgQ ipc-chip ipc-chip--on-baseAlt"] > span[class="ipc-chip__text"]'
    )
      .toArray()
      .map((ele) => {
        genre.push(ele.children[0].data);
      });
    imdbData.push({
      title,
      image,
      rating,
      summary,
      genre,
    });
  }

  console.log(imdbData);
})();
