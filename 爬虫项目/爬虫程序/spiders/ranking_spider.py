import scrapy
from ..数据模型 import UniversityItem

class RankingSpider(scrapy.Spider):
    name = 'university_rankings'
    allowed_domains = ['topuniversities.com']
    start_urls = ['https://www.topuniversities.com/university-rankings/world-university-rankings/2024']

    def parse(self, response):
        universities = response.css('div.ranking-results-table tbody tr')
        
        for university in universities:
            item = UniversityItem()
            
            item['rank'] = university.css('td.rank::text').get()
            item['name'] = university.css('td.uni-link a::text').get()
            item['country'] = university.css('td.country a::text').get()
            
            # 获取详细信息的链接
            detail_url = university.css('td.uni-link a::attr(href)').get()
            if detail_url:
                yield response.follow(detail_url, self.parse_university, meta={'item': item})
            else:
                yield item

    def parse_university(self, response):
        item = response.meta['item']
        
        # 提取更多信息
        item['description'] = response.css('div.university-description::text').get()
        item['website'] = response.css('div.university-website a::attr(href)').get()
        
        # 提取学费信息
        tuition = response.css('div.tuition-fees::text').get()
        if tuition:
            item['tuition'] = tuition.strip()
        
        yield item
