const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');

const url = 'https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch';

async function scrapeJobs() {
  try {
   
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let jobTitles = [];
    let companyNames = [];
    let locations = [];
    let jobTypes = [];
    let postedDates = [];
    let jobDescriptions = [];

    $('.jobTuple').each((index, element) => {
      let title = $(element).find('.title').text().trim();
      let company = $(element).find('.subTitle').text().trim();
      let location = $(element).find('.location').text().trim();
      let jobType = $(element).find('.type').text().trim();
      let postedDate = $(element).find('.date').text().trim();
      let description = $(element).find('.jobDescription').text().trim();

      jobTitles.push(title);
      companyNames.push(company);
      locations.push(location);
      jobTypes.push(jobType);
      postedDates.push(postedDate);
      jobDescriptions.push(description);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tech Jobs');

    worksheet.columns = [
      { header: 'Job Title', key: 'jobTitle', width: 30 },
      { header: 'Company Name', key: 'companyName', width: 30 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Job Type', key: 'jobType', width: 15 },
      { header: 'Posted Date', key: 'postedDate', width: 15 },
      { header: 'Job Description', key: 'jobDescription', width: 50 },
    ];

    jobTitles.forEach((title, index) => {
      worksheet.addRow({
        jobTitle: title,
        companyName: companyNames[index],
        location: locations[index],
        jobType: jobTypes[index],
        postedDate: postedDates[index],
        jobDescription: jobDescriptions[index],
      });
    });

    await workbook.xlsx.writeFile('tech_job_postings.xlsx');
    console.log('Data has been successfully scraped and saved to tech_job_postings.xlsx');
  } catch (error) {
    console.error('Error scraping job postings:', error);
  }
}
async function scrapeJobs() {
    try {
        const response = await axios.get('https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch');
        console.log(response.data);
    } catch (error) {
        console.error('Error scraping job postings:', error.message);
        if (error.code === 'ECONNRESET') {
            // Handle the ECONNRESET error specifically
            console.log('Connection was reset. Try again later.');
        }
    }
}

scrapeJobs();
