from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from university_scraper.spiders.university_spider import UniversitySpider

def run_spider():
    process = CrawlerProcess(get_project_settings())
    process.crawl(UniversitySpider)
    process.start()

if __name__ == '__main__':
    run_spider()
