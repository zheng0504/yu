# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class UniversityScraperPipeline:
    def process_item(self, item, spider):
        # 数据清洗
        if 'name' in item:
            item['name'] = item['name'].strip()
        
        if 'admission_requirements' in item:
            item['admission_requirements'] = item['admission_requirements'].strip()
        
        if 'website' in item and item['website']:
            if not item['website'].startswith(('http://', 'https://')):
                item['website'] = 'https://' + item['website']
        
        return item
