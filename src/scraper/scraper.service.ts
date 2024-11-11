import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as cheerio from 'cheerio';
import { ProthomAloSection } from './types/prothom-alo.type';

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);
    private $: cheerio.CheerioAPI;

    @Cron(CronExpression.EVERY_2_HOURS, { name: 'scraper', timeZone: 'BST' })
    handleCron() {
        this.scrape();
    }

    private async scrape() {
        this.logger.debug('Started scraping...');

        await this.scrapeProthomAlo();

        this.logger.debug('Finished scraping');
    }

    private async scrapeProthomAlo() {
        const urls: Record<ProthomAloSection, string> = {
            sports: 'https://www.prothomalo.com/sports',
            opinion: 'https://www.prothomalo.com/opinion',
            business: 'https://www.prothomalo.com/business',
            youth: 'https://www.prothomalo.com/youth',
            entertainment: 'https://www.prothomalo.com/entertainment',
            lifestyle: 'https://www.prothomalo.com/lifestyle',
        };

        for (const [key, url] of Object.entries(urls)) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = await response.text();
                this.$ = cheerio.load(html);
                const headlines = this.$('h2.title')
                    .map((i, el) => this.$(el).text())
                    .get();
                this.logger.debug(`Headlines for ${key}: ${headlines.join(', ')}`);
            } catch (error) {
                this.logger.error(`Error scraping ${key}: ${error.message}`);
            }
        }
    }
}
