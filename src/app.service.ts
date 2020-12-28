import {
  BadRequestException,
  HttpService,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const FIREBASE_DYNAMIC_LINK_BASE_URL =
  'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async generateNewDynamicLink() {
    try {
      const webAPIKey = this.configService.get<string>('FIREBASE_WEB_API_KEY');
      if (!webAPIKey) throw new BadRequestException();

      const axiosResponse = await this.httpService
        .post(
          `${FIREBASE_DYNAMIC_LINK_BASE_URL}${webAPIKey}`,
          {
            dynamicLinkInfo: {
              domainUriPrefix: 'https://restasssurant.page.link',
              link: 'https://www.youtube.com/',
              androidInfo: {
                androidPackageName: 'com.example.android',
              },
              iosInfo: {
                iosBundleId: 'com.2hu.restoner.restaurant.app',
              },
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .toPromise();

      return axiosResponse.data;
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException();
    }
  }
}
