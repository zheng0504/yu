import scrapy
import logging
from ..items import UniversityItem

class UniversitySpider(scrapy.Spider):
    name = 'university'
    
    # 直接使用加州大学列表页面
    start_urls = ['https://en.wikipedia.org/wiki/List_of_colleges_and_universities_in_California']
    
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 1,  # 减少延迟时间
    }
    
    def __init__(self, *args, **kwargs):
        super(UniversitySpider, self).__init__(*args, **kwargs)
        self.universities_count = 0
        self.max_universities = 10  # 限制只爬取前10所大学
    
    def parse(self, response):
        self.logger.info(f'Parsing California universities page: {response.url}')
        
        # 遍历所有表格
        for table in response.xpath('//table[contains(@class, "wikitable")]'):
            # 遍历表格中的每一行（跳过表头）
            for row in table.xpath('.//tr[position()>1]'):
                if self.universities_count >= self.max_universities:
                    self.logger.info('Reached maximum number of universities')
                    return
                
                try:
                    # 检查行是否包含足够的单元格
                    cells = row.xpath('.//td')
                    if len(cells) >= 2:
                        item = UniversityItem()
                        
                        # 提取大学名称
                        name = cells[0].xpath('.//a/text()').get() or cells[0].xpath('.//text()').get()
                        if name:
                            item['name'] = name.strip()
                            
                            # 提取城市信息
                            location = cells[1].xpath('.//text()').get()
                            if location:
                                item['location'] = location.strip()
                            
                            # 获取大学详情页链接
                            detail_link = cells[0].xpath('.//a/@href').get()
                            if detail_link and detail_link.startswith('/wiki/'):
                                self.universities_count += 1
                                yield scrapy.Request(
                                    response.urljoin(detail_link),
                                    callback=self.parse_university_detail,
                                    meta={'item': item}
                                )
                            else:
                                self.universities_count += 1
                                self.logger.info(f'Extracted basic info for: {item["name"]}')
                                yield item
                
                except Exception as e:
                    self.logger.error(f'Error processing row: {str(e)}')
    
    def parse_university_detail(self, response):
        item = response.meta['item']
        
        try:
            # 从信息框中提取信息
            infobox = response.xpath('//table[contains(@class, "infobox")]')
            
            # 提取官网链接
            website = infobox.xpath('.//th[contains(text(), "Website")]/following-sibling::td//a/@href').get()
            if website:
                item['website'] = website
            
            # 提取学费信息
            tuition = infobox.xpath('.//th[contains(text(), "Tuition")]/following-sibling::td//text()').get()
            if tuition:
                item['tuition'] = tuition.strip()
            
            self.logger.info(f'Successfully extracted details for: {item["name"]}')
        except Exception as e:
            self.logger.error(f'Error extracting details for {item["name"]}: {str(e)}')
        
        yield item
