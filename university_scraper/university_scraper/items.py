# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class UniversityScraperItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class UniversityItem(scrapy.Item):
    name = scrapy.Field()                    # 大学名称
    ranking = scrapy.Field()                 # 排名
    location = scrapy.Field()                # 位置
    tuition = scrapy.Field()                 # 学费
    website = scrapy.Field()                 # 网站（如果有）
