import { EnviromentDto } from './dto/enviroment.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const EnvironmentValidate = (config: Record<string, unknown>) => {
  const validateConfig = plainToInstance(EnviromentDto, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    // console.log(`errors: `, errors);
    throw new Error(errors.toString());
  }
  // console.log(`validateConfig`, validateConfig);
  return validateConfig;
};