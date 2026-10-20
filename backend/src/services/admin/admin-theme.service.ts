import { themeRepository } from '../../repositories/theme.repository';
import { ThemeSettings } from '../../types/database.types';
import { AppError } from '../../errors/app-error';

// Helper function to sanitize font family strings against raw CSS/HTML injections.
function assertSafeString(value: string | undefined, fieldName: string): void {
  if (!value) return;
  if (/<script|javascript:|<style|[\{\}\<\>]|expression\(/i.test(value)) {
    throw AppError.badRequest(`Unsafe script or markup injection detected in theme field '${fieldName}'.`);
  }
}

// Service orchestrating administrative theme customization with injection sanitization.
export class AdminThemeService {
  // Retrieves current active theme settings document.
  async getThemeSettings(): Promise<ThemeSettings> {
    return themeRepository.getActiveThemeSettings();
  }

  // Updates active theme settings document after validating security and injection constraints.
  async updateThemeSettings(data: Partial<ThemeSettings>): Promise<ThemeSettings> {
    if (data.fonts) {
      assertSafeString(data.fonts.headingFont, 'fonts.headingFont');
      assertSafeString(data.fonts.bodyFont, 'fonts.bodyFont');
      assertSafeString(data.fonts.accentFont, 'fonts.accentFont');
    }

    if (data.colors) {
      Object.entries(data.colors).forEach(([key, val]) => {
        assertSafeString(val, `colors.${key}`);
      });
    }

    return themeRepository.updateThemeSettings(data);
  }
}

export const adminThemeService = new AdminThemeService();
